"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.generateSecret = void 0;
const notp_1 = __importDefault(require("notp"));
const crypto_1 = __importDefault(require("crypto"));
const thirty_two_1 = __importDefault(require("thirty-two"));
const qrcode_1 = require("qrcode");
function teste(dados) {
    return __awaiter(this, void 0, void 0, function* () {
        const retorno = yield (0, qrcode_1.toDataURL)(dados);
        console.log(dados, "otp token qr: ", retorno);
        return retorno;
    });
}
//qr: `https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=${uri}${encodedQuery}`,
function generateSecret(options) {
    var _a;
    const config = {
        name: encodeURIComponent((_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : "App"),
        account: encodeURIComponent((options === null || options === void 0 ? void 0 : options.account) ? `:${options.account}` : ""),
    };
    const bin = crypto_1.default.randomBytes(20);
    const base32 = thirty_two_1.default.encode(bin).toString("utf8").replace(/=/g, "");
    const secret = base32
        .toLowerCase()
        .replace(/(\w{4})/g, "$1 ")
        .trim()
        .split(" ")
        .join("")
        .toUpperCase();
    const query = `?secret=${secret}&issuer=${config.name}`;
    const encodedQuery = query.replace('?', '%3F').replace('&', '%26');
    const uri = `otpauth://totp/${config.name}${config.account}`;
    const qrcode = teste(`${uri}${query}`);
    return {
        secret,
        uri: `${uri}${query}`,
        qr: `${qrcode}`
    };
}
exports.generateSecret = generateSecret;
function generateToken(secret) {
    if (!secret || !secret.length)
        return null;
    const unformatted = secret.replace(/\W+/g, "").toUpperCase();
    const bin = thirty_two_1.default.decode(unformatted);
    return { token: notp_1.default.totp.gen(bin) };
}
exports.generateToken = generateToken;
function verifyToken(secret, token, window = 4) {
    if (!token || !token.length)
        return null;
    const unformatted = secret.replace(/\W+/g, "").toUpperCase();
    const bin = thirty_two_1.default.decode(unformatted);
    return notp_1.default.totp.verify(token.replace(/\W+/g, ""), bin, {
        window,
        time: 30,
    });
}
exports.verifyToken = verifyToken;

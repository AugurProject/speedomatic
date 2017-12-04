/// <reference types="node" />

import { BigNumber } from "bignumber.js";

type AbiEncodedData = string;
type Address = string;
type Int256 = string;
type RidiculouslyFlexibleFailure = Error|object|null|undefined;
type RidiculouslyFlexibleInput = Buffer|BigNumber|string|number|object|boolean|Array<Buffer|BigNumber|string|number|object|boolean>;
type RidiculouslyFlexibleOutput = BigNumber|string|number|RidiculouslyFlexibleFailure;

interface Constants {
  FXP_ONE: BigNumber;
  BYTES_32: BigNumber;
  INT256_MIN_VALUE: BigNumber;
  INT256_MAX_VALUE: BigNumber;
  UINT256_MAX_VALUE: BigNumber;
}
export interface AbiInput {
  name: string;
  type: string;
  indexed?: boolean;
}
export interface TransactionPayload {
  name: string;
  params: Array<string|number>;
  signature?: Array<string>;
  [otherPayloadField: string]: any;
}

export const constants: Constants;
export const version: string;

export function unrollArray(string: string, returns?: string|null, stride?: number|null, init?: number|null): Array<string>|string;
export function byteArrayToUtf8String(byteArray: Buffer|Array<string|number>|string): string;
export function byteArrayToHexString(b: Array<number>): string;
export function abiEncodeShortStringAsInt256(shortString: string): Int256;
export function abiDecodeShortStringAsInt256(int256: Int256): string;
export function abiEncodeBytes(bytesToEncode: string, isPadded?: boolean|null): string;
export function abiDecodeBytes(abiEncodedBytes: string|Buffer, strip?: boolean|null): string;
export function unfork(forked: Int256|number, prefix?: boolean|null): Int256;
export function hex(n: RidiculouslyFlexibleInput, isWrapped?: boolean|null): string;
export function isHex(str: any): boolean;
export function formatInt256(s?: Buffer|string|null|Array<Buffer|string|null>): Int256;
export function formatEthereumAddress(addr: string|Array<string>): Address;
export function strip0xPrefix(str: string): string;
export function prefixHex(n: string|number|BigNumber): string;
export function bignum(n: RidiculouslyFlexibleInput, encoding?: string|null, isWrapped?: boolean|null): RidiculouslyFlexibleOutput;
export function fix(n: RidiculouslyFlexibleInput, encoding?: string|null, isWrapped?: boolean|null): RidiculouslyFlexibleOutput;
export function unfix(n: RidiculouslyFlexibleInput, encoding?: string|null): RidiculouslyFlexibleOutput;
export function unfixSigned(n: RidiculouslyFlexibleInput, encoding?: string|null): RidiculouslyFlexibleOutput;
export function encodeNumberAsBase10String(n: RidiculouslyFlexibleInput, encoding?: string|null, isWrapped?: boolean|null): string|RidiculouslyFlexibleFailure;
export function encodeNumberAsJSNumber(n: RidiculouslyFlexibleInput, encoding?: string|null, isWrapped?: boolean|null): number|RidiculouslyFlexibleFailure;
export function padRight(s: string, chunkLength?: number|null, hasPrefix?: boolean|null): string;
export function padLeft(s: string, chunkLength?: number|null, hasPrefix?: boolean|null): string;
export function abiEncodeInt256(value: number|string): Int256;
export function abiEncodeTransactionPayload(payload: TransactionPayload): AbiEncodedData;
export function abiDecodeData(inputs: Array<AbiInput>, abiEncodedData: AbiEncodedData): Array<string>;
export function abiDecodeRpcResponse(responseType: string, abiEncodedRpcResponse: AbiEncodedData): string|Array<string>|boolean|null;
export function formatAbiRawDecodedDataArray(dataInputTypes: Array<string>, decodedDataArray: Array<any>): Array<string>;
export function formatAbiRawDecodedData(inputType: string, decodedData: any): string;
export function serialize(x?: Buffer|string|number|Array<Buffer|string|number>): string|null|undefined;

/* tslint:disable */
/* eslint-disable */
/**
 * The `ReadableStreamType` enum.
 *
 * *This API requires the following crate features to be activated: `ReadableStreamType`*
 */

type ReadableStreamType = "bytes";

export class IntoUnderlyingByteSource {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    cancel(): void;
    pull(controller: ReadableByteStreamController): Promise<any>;
    start(controller: ReadableByteStreamController): void;
    readonly autoAllocateChunkSize: number;
    readonly type: ReadableStreamType;
}

export class IntoUnderlyingSink {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    abort(reason: any): Promise<any>;
    close(): Promise<any>;
    write(chunk: any): Promise<any>;
}

export class IntoUnderlyingSource {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    cancel(): void;
    pull(controller: ReadableStreamDefaultController): Promise<any>;
}

export class WrappedProvingProvider {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    check(ser_preimage: Uint8Array, _key_location: string): Promise<any[]>;
    getParams(k: number): Promise<any>;
    lookupKey(key_location: string): Promise<any>;
    prove(ser_preimage: Uint8Array, _key_location: string, overwrite_binding_input?: bigint | null): Promise<Uint8Array>;
}

export class Zkir {
    free(): void;
    [Symbol.dispose](): void;
    static deserialize(bytes: Uint8Array): Zkir;
    static fromJson(json: string): Zkir;
    getK(): number;
    constructor();
    serialize(): Uint8Array;
}

export function check(ser_preimage: Uint8Array, provider: any): Promise<any[]>;

export function jsonIrToBinary(json: string): Uint8Array;

export function prove(ser_preimage: Uint8Array, provider: any, overwrite_binding_input?: bigint | null): Promise<Uint8Array>;

export function provingProvider(km_provider: any): WrappedProvingProvider;

/* @ts-self-types="./midnight_zkir_v3_wasm.d.ts" */

import * as wasm from "./midnight_zkir_v3_wasm_bg.wasm";
import { __wbg_set_wasm } from "./midnight_zkir_v3_wasm_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    IntoUnderlyingByteSource, IntoUnderlyingSink, IntoUnderlyingSource, WrappedProvingProvider, Zkir, check, jsonIrToBinary, prove, provingProvider
} from "./midnight_zkir_v3_wasm_bg.js";

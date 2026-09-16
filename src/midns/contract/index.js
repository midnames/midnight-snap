import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.19.0');

export var AddressType;
(function (AddressType) {
  AddressType[AddressType['ContractAddr'] = 0] = 'ContractAddr';
  AddressType[AddressType['ZswapCPKAddr'] = 1] = 'ZswapCPKAddr';
  AddressType[AddressType['UnshieldedAddr'] = 2] = 'UnshieldedAddr';
})(AddressType || (AddressType = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(31n, 1);

const _descriptor_1 = new __compactRuntime.CompactTypeVector(32, _descriptor_0);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_3 = __compactRuntime.CompactTypeBoolean;

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_5 = new __compactRuntime.CompactTypeBytes(32);

class _UserAddress_0 {
  alignment() {
    return _descriptor_5.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.bytes);
  }
}

const _descriptor_6 = new _UserAddress_0();

const _descriptor_7 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_8 = __compactRuntime.CompactTypeOpaqueString;

class _Maybe_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_8.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_3.fromValue(value_0),
      value: _descriptor_8.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_some).concat(_descriptor_8.toValue(value_0.value));
  }
}

const _descriptor_9 = new _Maybe_0();

const _descriptor_10 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _PaymentConfig_0 {
  alignment() {
    return _descriptor_10.alignment().concat(_descriptor_10.alignment().concat(_descriptor_10.alignment().concat(_descriptor_5.alignment().concat(_descriptor_3.alignment()))));
  }
  fromValue(value_0) {
    return {
      cost_short: _descriptor_10.fromValue(value_0),
      cost_med: _descriptor_10.fromValue(value_0),
      cost_long: _descriptor_10.fromValue(value_0),
      coin_color: _descriptor_5.fromValue(value_0),
      buy_enabled: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_10.toValue(value_0.cost_short).concat(_descriptor_10.toValue(value_0.cost_med).concat(_descriptor_10.toValue(value_0.cost_long).concat(_descriptor_5.toValue(value_0.coin_color).concat(_descriptor_3.toValue(value_0.buy_enabled)))));
  }
}

const _descriptor_11 = new _PaymentConfig_0();

class _DomainData_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_6.alignment().concat(_descriptor_5.alignment().concat(_descriptor_7.alignment().concat(_descriptor_9.alignment().concat(_descriptor_11.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment())))))));
  }
  fromValue(value_0) {
    return {
      owner_public_key: _descriptor_5.fromValue(value_0),
      owner_address: _descriptor_6.fromValue(value_0),
      target: _descriptor_5.fromValue(value_0),
      target_type: _descriptor_7.fromValue(value_0),
      default_field: _descriptor_9.fromValue(value_0),
      payment_config: _descriptor_11.fromValue(value_0),
      target_locked: _descriptor_3.fromValue(value_0),
      payment_config_locked: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.owner_public_key).concat(_descriptor_6.toValue(value_0.owner_address).concat(_descriptor_5.toValue(value_0.target).concat(_descriptor_7.toValue(value_0.target_type).concat(_descriptor_9.toValue(value_0.default_field).concat(_descriptor_11.toValue(value_0.payment_config).concat(_descriptor_3.toValue(value_0.target_locked).concat(_descriptor_3.toValue(value_0.payment_config_locked))))))));
  }
}

const _descriptor_12 = new _DomainData_0();

const _descriptor_13 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

class _tuple_0 {
  alignment() {
    return _descriptor_8.alignment().concat(_descriptor_8.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_8.fromValue(value_0),
      _descriptor_8.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_8.toValue(value_0[0]).concat(_descriptor_8.toValue(value_0[1]));
  }
}

const _descriptor_14 = new _tuple_0();

class _Maybe_1 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_14.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_3.fromValue(value_0),
      value: _descriptor_14.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_some).concat(_descriptor_14.toValue(value_0.value));
  }
}

const _descriptor_15 = new _Maybe_1();

const _descriptor_16 = new __compactRuntime.CompactTypeVector(10, _descriptor_15);

class _DomainReference_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_4.alignment());
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_5.fromValue(value_0),
      parent_id: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.domain).concat(_descriptor_4.toValue(value_0.parent_id));
  }
}

const _descriptor_17 = new _DomainReference_0();

const _descriptor_18 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _Maybe_2 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_4.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_3.fromValue(value_0),
      value: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_some).concat(_descriptor_4.toValue(value_0.value));
  }
}

const _descriptor_19 = new _Maybe_2();

class _tuple_1 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_5.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_5.fromValue(value_0),
      _descriptor_5.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0[0]).concat(_descriptor_5.toValue(value_0[1]));
  }
}

const _descriptor_20 = new _tuple_1();

class _Either_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_3.fromValue(value_0),
      left: _descriptor_5.fromValue(value_0),
      right: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_left).concat(_descriptor_5.toValue(value_0.left).concat(_descriptor_5.toValue(value_0.right)));
  }
}

const _descriptor_21 = new _Either_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_5.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.bytes);
  }
}

const _descriptor_22 = new _ContractAddress_0();

class _Either_1 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_22.alignment().concat(_descriptor_6.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_3.fromValue(value_0),
      left: _descriptor_22.fromValue(value_0),
      right: _descriptor_6.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_left).concat(_descriptor_22.toValue(value_0.left).concat(_descriptor_6.toValue(value_0.right)));
  }
}

const _descriptor_23 = new _Either_1();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.domainSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named domainSecretKey');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      change_root_enable_subdomains: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`change_root_enable_subdomains: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const b_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('change_root_enable_subdomains',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 25 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(b_0) === 'boolean')) {
          __compactRuntime.typeError('change_root_enable_subdomains',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 25 char 1',
                                     'Boolean',
                                     b_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(b_0),
            alignment: _descriptor_3.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._change_root_enable_subdomains_0(context,
                                                                     partialProofData,
                                                                     b_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      change_field_limit: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`change_field_limit: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const val_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('change_field_limit',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 28 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(val_0) === 'object' && typeof(val_0.is_some) === 'boolean' && typeof(val_0.value) === 'bigint' && val_0.value >= 0n && val_0.value <= 18446744073709551615n)) {
          __compactRuntime.typeError('change_field_limit',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 28 char 1',
                                     'struct Maybe<is_some: Boolean, value: Uint<0..18446744073709551616>>',
                                     val_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_19.toValue(val_0),
            alignment: _descriptor_19.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._change_field_limit_0(context,
                                                          partialProofData,
                                                          val_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      create_domain: async (...args_1) => {
        if (args_1.length !== 10) {
          throw new __compactRuntime.CompactError(`create_domain: expected 10 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const owner_address_0 = args_1[1];
        const domain_0 = args_1[2];
        const len_0 = args_1[3];
        const parent_id_0 = args_1[4];
        const target_0 = args_1[5];
        const target_type_0 = args_1[6];
        const default_field_0 = args_1[7];
        const payment_config_0 = args_1[8];
        const kvs_0 = args_1[9];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('create_domain',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(owner_address_0) === 'object' && owner_address_0.bytes.buffer instanceof ArrayBuffer && owner_address_0.bytes.BYTES_PER_ELEMENT === 1 && owner_address_0.bytes.length === 32)) {
          __compactRuntime.typeError('create_domain',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     owner_address_0)
        }
        if (!(domain_0.buffer instanceof ArrayBuffer && domain_0.BYTES_PER_ELEMENT === 1 && domain_0.length === 32)) {
          __compactRuntime.typeError('create_domain',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'Bytes<32>',
                                     domain_0)
        }
        if (!(typeof(len_0) === 'bigint' && len_0 >= 0n && len_0 <= 4294967295n)) {
          __compactRuntime.typeError('create_domain',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'Uint<0..4294967296>',
                                     len_0)
        }
        if (!(typeof(parent_id_0) === 'bigint' && parent_id_0 >= 0n && parent_id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('create_domain',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'Uint<0..18446744073709551616>',
                                     parent_id_0)
        }
        if (!(target_0.buffer instanceof ArrayBuffer && target_0.BYTES_PER_ELEMENT === 1 && target_0.length === 32)) {
          __compactRuntime.typeError('create_domain',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'Bytes<32>',
                                     target_0)
        }
        if (!(typeof(target_type_0) === 'number' && target_type_0 >= 0 && target_type_0 <= 2)) {
          __compactRuntime.typeError('create_domain',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'Enum<AddressType, ContractAddr, ZswapCPKAddr, UnshieldedAddr>',
                                     target_type_0)
        }
        if (!(typeof(default_field_0) === 'object' && typeof(default_field_0.is_some) === 'boolean' && typeof (default_field_0.value) === 'string')) {
          __compactRuntime.typeError('create_domain',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'struct Maybe<is_some: Boolean, value: Opaque<"string">>',
                                     default_field_0)
        }
        if (!(typeof(payment_config_0) === 'object' && typeof(payment_config_0.cost_short) === 'bigint' && payment_config_0.cost_short >= 0n && payment_config_0.cost_short <= 340282366920938463463374607431768211455n && typeof(payment_config_0.cost_med) === 'bigint' && payment_config_0.cost_med >= 0n && payment_config_0.cost_med <= 340282366920938463463374607431768211455n && typeof(payment_config_0.cost_long) === 'bigint' && payment_config_0.cost_long >= 0n && payment_config_0.cost_long <= 340282366920938463463374607431768211455n && payment_config_0.coin_color.buffer instanceof ArrayBuffer && payment_config_0.coin_color.BYTES_PER_ELEMENT === 1 && payment_config_0.coin_color.length === 32 && typeof(payment_config_0.buy_enabled) === 'boolean')) {
          __compactRuntime.typeError('create_domain',
                                     'argument 8 (argument 9 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'struct PaymentConfig<cost_short: Uint<0..340282366920938463463374607431768211456>, cost_med: Uint<0..340282366920938463463374607431768211456>, cost_long: Uint<0..340282366920938463463374607431768211456>, coin_color: Bytes<32>, buy_enabled: Boolean>',
                                     payment_config_0)
        }
        if (!(Array.isArray(kvs_0) && kvs_0.length === 10 && kvs_0.every((t) => typeof(t) === 'object' && typeof(t.is_some) === 'boolean' && Array.isArray(t.value) && t.value.length === 2  && typeof (t.value[0]) === 'string' && typeof (t.value[1]) === 'string'))) {
          __compactRuntime.typeError('create_domain',
                                     'argument 9 (argument 10 as invoked from Typescript)',
                                     'ns.compact line 168 char 1',
                                     'Vector<10, struct Maybe<is_some: Boolean, value: [Opaque<"string">, Opaque<"string">]>>',
                                     kvs_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_6.toValue(owner_address_0).concat(_descriptor_5.toValue(domain_0).concat(_descriptor_13.toValue(len_0).concat(_descriptor_4.toValue(parent_id_0).concat(_descriptor_5.toValue(target_0).concat(_descriptor_7.toValue(target_type_0).concat(_descriptor_9.toValue(default_field_0).concat(_descriptor_11.toValue(payment_config_0).concat(_descriptor_16.toValue(kvs_0))))))))),
            alignment: _descriptor_6.alignment().concat(_descriptor_5.alignment().concat(_descriptor_13.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_7.alignment().concat(_descriptor_9.alignment().concat(_descriptor_11.alignment().concat(_descriptor_16.alignment()))))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._create_domain_0(context,
                                                     partialProofData,
                                                     owner_address_0,
                                                     domain_0,
                                                     len_0,
                                                     parent_id_0,
                                                     target_0,
                                                     target_type_0,
                                                     default_field_0,
                                                     payment_config_0,
                                                     kvs_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      update_target: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`update_target: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        const target_0 = args_1[2];
        const target_type_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('update_target',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 252 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('update_target',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 252 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        if (!(target_0.buffer instanceof ArrayBuffer && target_0.BYTES_PER_ELEMENT === 1 && target_0.length === 32)) {
          __compactRuntime.typeError('update_target',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ns.compact line 252 char 1',
                                     'Bytes<32>',
                                     target_0)
        }
        if (!(typeof(target_type_0) === 'number' && target_type_0 >= 0 && target_type_0 <= 2)) {
          __compactRuntime.typeError('update_target',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'ns.compact line 252 char 1',
                                     'Enum<AddressType, ContractAddr, ZswapCPKAddr, UnshieldedAddr>',
                                     target_type_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0).concat(_descriptor_5.toValue(target_0).concat(_descriptor_7.toValue(target_type_0))),
            alignment: _descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_7.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._update_target_0(context,
                                                     partialProofData,
                                                     id_0,
                                                     target_0,
                                                     target_type_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      update_payment_config: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`update_payment_config: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        const pc_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('update_payment_config',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 267 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('update_payment_config',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 267 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        if (!(typeof(pc_0) === 'object' && typeof(pc_0.cost_short) === 'bigint' && pc_0.cost_short >= 0n && pc_0.cost_short <= 340282366920938463463374607431768211455n && typeof(pc_0.cost_med) === 'bigint' && pc_0.cost_med >= 0n && pc_0.cost_med <= 340282366920938463463374607431768211455n && typeof(pc_0.cost_long) === 'bigint' && pc_0.cost_long >= 0n && pc_0.cost_long <= 340282366920938463463374607431768211455n && pc_0.coin_color.buffer instanceof ArrayBuffer && pc_0.coin_color.BYTES_PER_ELEMENT === 1 && pc_0.coin_color.length === 32 && typeof(pc_0.buy_enabled) === 'boolean')) {
          __compactRuntime.typeError('update_payment_config',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ns.compact line 267 char 1',
                                     'struct PaymentConfig<cost_short: Uint<0..340282366920938463463374607431768211456>, cost_med: Uint<0..340282366920938463463374607431768211456>, cost_long: Uint<0..340282366920938463463374607431768211456>, coin_color: Bytes<32>, buy_enabled: Boolean>',
                                     pc_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0).concat(_descriptor_11.toValue(pc_0)),
            alignment: _descriptor_4.alignment().concat(_descriptor_11.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._update_payment_config_0(context,
                                                             partialProofData,
                                                             id_0,
                                                             pc_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      transfer_domain: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`transfer_domain: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const domain_0 = args_1[1];
        const parent_id_0 = args_1[2];
        const new_owner_0 = args_1[3];
        const new_owner_address_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('transfer_domain',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 282 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(domain_0.buffer instanceof ArrayBuffer && domain_0.BYTES_PER_ELEMENT === 1 && domain_0.length === 32)) {
          __compactRuntime.typeError('transfer_domain',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 282 char 1',
                                     'Bytes<32>',
                                     domain_0)
        }
        if (!(typeof(parent_id_0) === 'bigint' && parent_id_0 >= 0n && parent_id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('transfer_domain',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ns.compact line 282 char 1',
                                     'Uint<0..18446744073709551616>',
                                     parent_id_0)
        }
        if (!(new_owner_0.buffer instanceof ArrayBuffer && new_owner_0.BYTES_PER_ELEMENT === 1 && new_owner_0.length === 32)) {
          __compactRuntime.typeError('transfer_domain',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'ns.compact line 282 char 1',
                                     'Bytes<32>',
                                     new_owner_0)
        }
        if (!(typeof(new_owner_address_0) === 'object' && new_owner_address_0.bytes.buffer instanceof ArrayBuffer && new_owner_address_0.bytes.BYTES_PER_ELEMENT === 1 && new_owner_address_0.bytes.length === 32)) {
          __compactRuntime.typeError('transfer_domain',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'ns.compact line 282 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     new_owner_address_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(domain_0).concat(_descriptor_4.toValue(parent_id_0).concat(_descriptor_5.toValue(new_owner_0).concat(_descriptor_6.toValue(new_owner_address_0)))),
            alignment: _descriptor_5.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_6.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._transfer_domain_0(context,
                                                       partialProofData,
                                                       domain_0,
                                                       parent_id_0,
                                                       new_owner_0,
                                                       new_owner_address_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      add_domain_field: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`add_domain_field: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        const k_0 = args_1[2];
        const v_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('add_domain_field',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 317 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('add_domain_field',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 317 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        if (!(typeof (k_0) === 'string')) {
          __compactRuntime.typeError('add_domain_field',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ns.compact line 317 char 1',
                                     'Opaque<"string">',
                                     k_0)
        }
        if (!(typeof (v_0) === 'string')) {
          __compactRuntime.typeError('add_domain_field',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'ns.compact line 317 char 1',
                                     'Opaque<"string">',
                                     v_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0).concat(_descriptor_8.toValue(k_0).concat(_descriptor_8.toValue(v_0))),
            alignment: _descriptor_4.alignment().concat(_descriptor_8.alignment().concat(_descriptor_8.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._add_domain_field_0(context,
                                                        partialProofData,
                                                        id_0,
                                                        k_0,
                                                        v_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      add_multiple_fields: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`add_multiple_fields: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        const kvs_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('add_multiple_fields',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 326 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('add_multiple_fields',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 326 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        if (!(Array.isArray(kvs_0) && kvs_0.length === 10 && kvs_0.every((t) => typeof(t) === 'object' && typeof(t.is_some) === 'boolean' && Array.isArray(t.value) && t.value.length === 2  && typeof (t.value[0]) === 'string' && typeof (t.value[1]) === 'string'))) {
          __compactRuntime.typeError('add_multiple_fields',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ns.compact line 326 char 1',
                                     'Vector<10, struct Maybe<is_some: Boolean, value: [Opaque<"string">, Opaque<"string">]>>',
                                     kvs_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0).concat(_descriptor_16.toValue(kvs_0)),
            alignment: _descriptor_4.alignment().concat(_descriptor_16.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._add_multiple_fields_0(context,
                                                           partialProofData,
                                                           id_0,
                                                           kvs_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      remove_domain_field: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`remove_domain_field: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        const k_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('remove_domain_field',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 342 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('remove_domain_field',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 342 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        if (!(typeof (k_0) === 'string')) {
          __compactRuntime.typeError('remove_domain_field',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ns.compact line 342 char 1',
                                     'Opaque<"string">',
                                     k_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0).concat(_descriptor_8.toValue(k_0)),
            alignment: _descriptor_4.alignment().concat(_descriptor_8.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._remove_domain_field_0(context,
                                                           partialProofData,
                                                           id_0,
                                                           k_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      clear_domain_fields: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`clear_domain_fields: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('clear_domain_fields',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 348 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('clear_domain_fields',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 348 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0),
            alignment: _descriptor_4.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._clear_domain_fields_0(context,
                                                           partialProofData,
                                                           id_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      update_domain_default_field: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`update_domain_default_field: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        const d_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('update_domain_default_field',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 355 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('update_domain_default_field',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 355 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        if (!(typeof(d_0) === 'object' && typeof(d_0.is_some) === 'boolean' && typeof (d_0.value) === 'string')) {
          __compactRuntime.typeError('update_domain_default_field',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ns.compact line 355 char 1',
                                     'struct Maybe<is_some: Boolean, value: Opaque<"string">>',
                                     d_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0).concat(_descriptor_9.toValue(d_0)),
            alignment: _descriptor_4.alignment().concat(_descriptor_9.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._update_domain_default_field_0(context,
                                                                   partialProofData,
                                                                   id_0,
                                                                   d_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      lock_target: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`lock_target: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('lock_target',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 373 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lock_target',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 373 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0),
            alignment: _descriptor_4.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._lock_target_0(context,
                                                   partialProofData,
                                                   id_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      lock_payment_config: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`lock_payment_config: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const id_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('lock_payment_config',
                                     'argument 1 (as invoked from Typescript)',
                                     'ns.compact line 387 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(id_0) === 'bigint' && id_0 >= 0n && id_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lock_payment_config',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ns.compact line 387 char 1',
                                     'Uint<0..18446744073709551616>',
                                     id_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(id_0),
            alignment: _descriptor_4.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._lock_payment_config_0(context,
                                                           partialProofData,
                                                           id_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      }
    };
    this.impureCircuits = {
      change_root_enable_subdomains: this.circuits.change_root_enable_subdomains,
      change_field_limit: this.circuits.change_field_limit,
      create_domain: this.circuits.create_domain,
      update_target: this.circuits.update_target,
      update_payment_config: this.circuits.update_payment_config,
      transfer_domain: this.circuits.transfer_domain,
      add_domain_field: this.circuits.add_domain_field,
      add_multiple_fields: this.circuits.add_multiple_fields,
      remove_domain_field: this.circuits.remove_domain_field,
      clear_domain_fields: this.circuits.clear_domain_fields,
      update_domain_default_field: this.circuits.update_domain_default_field,
      lock_target: this.circuits.lock_target,
      lock_payment_config: this.circuits.lock_payment_config
    };
    this.provableCircuits = {
      change_root_enable_subdomains: this.circuits.change_root_enable_subdomains,
      change_field_limit: this.circuits.change_field_limit,
      create_domain: this.circuits.create_domain,
      update_target: this.circuits.update_target,
      update_payment_config: this.circuits.update_payment_config,
      transfer_domain: this.circuits.transfer_domain,
      add_domain_field: this.circuits.add_domain_field,
      add_multiple_fields: this.circuits.add_multiple_fields,
      remove_domain_field: this.circuits.remove_domain_field,
      clear_domain_fields: this.circuits.clear_domain_fields,
      update_domain_default_field: this.circuits.update_domain_default_field,
      lock_target: this.circuits.lock_target,
      lock_payment_config: this.circuits.lock_payment_config
    };
  }
  async initialState(...args_0) {
    if (args_0.length !== 10) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 10 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const tld_0 = args_0[1];
    const target_0 = args_0[2];
    const target_type_0 = args_0[3];
    const default_field_0 = args_0[4];
    const payment_config_0 = args_0[5];
    const owner_address_0 = args_0[6];
    const kvs_0 = args_0[7];
    const field_limit_0 = args_0[8];
    const enable_subdomains_0 = args_0[9];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(typeof (tld_0) === 'string')) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'Opaque<"string">',
                                 tld_0)
    }
    if (!(target_0.buffer instanceof ArrayBuffer && target_0.BYTES_PER_ELEMENT === 1 && target_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'Bytes<32>',
                                 target_0)
    }
    if (!(typeof(target_type_0) === 'number' && target_type_0 >= 0 && target_type_0 <= 2)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 3 (argument 4 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'Enum<AddressType, ContractAddr, ZswapCPKAddr, UnshieldedAddr>',
                                 target_type_0)
    }
    if (!(typeof(default_field_0) === 'object' && typeof(default_field_0.is_some) === 'boolean' && typeof (default_field_0.value) === 'string')) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 4 (argument 5 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'struct Maybe<is_some: Boolean, value: Opaque<"string">>',
                                 default_field_0)
    }
    if (!(typeof(payment_config_0) === 'object' && typeof(payment_config_0.cost_short) === 'bigint' && payment_config_0.cost_short >= 0n && payment_config_0.cost_short <= 340282366920938463463374607431768211455n && typeof(payment_config_0.cost_med) === 'bigint' && payment_config_0.cost_med >= 0n && payment_config_0.cost_med <= 340282366920938463463374607431768211455n && typeof(payment_config_0.cost_long) === 'bigint' && payment_config_0.cost_long >= 0n && payment_config_0.cost_long <= 340282366920938463463374607431768211455n && payment_config_0.coin_color.buffer instanceof ArrayBuffer && payment_config_0.coin_color.BYTES_PER_ELEMENT === 1 && payment_config_0.coin_color.length === 32 && typeof(payment_config_0.buy_enabled) === 'boolean')) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 5 (argument 6 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'struct PaymentConfig<cost_short: Uint<0..340282366920938463463374607431768211456>, cost_med: Uint<0..340282366920938463463374607431768211456>, cost_long: Uint<0..340282366920938463463374607431768211456>, coin_color: Bytes<32>, buy_enabled: Boolean>',
                                 payment_config_0)
    }
    if (!(typeof(owner_address_0) === 'object' && owner_address_0.bytes.buffer instanceof ArrayBuffer && owner_address_0.bytes.BYTES_PER_ELEMENT === 1 && owner_address_0.bytes.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 6 (argument 7 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'struct UserAddress<bytes: Bytes<32>>',
                                 owner_address_0)
    }
    if (!(Array.isArray(kvs_0) && kvs_0.length === 10 && kvs_0.every((t) => typeof(t) === 'object' && typeof(t.is_some) === 'boolean' && Array.isArray(t.value) && t.value.length === 2  && typeof (t.value[0]) === 'string' && typeof (t.value[1]) === 'string'))) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 7 (argument 8 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'Vector<10, struct Maybe<is_some: Boolean, value: [Opaque<"string">, Opaque<"string">]>>',
                                 kvs_0)
    }
    if (!(typeof(field_limit_0) === 'object' && typeof(field_limit_0.is_some) === 'boolean' && typeof(field_limit_0.value) === 'bigint' && field_limit_0.value >= 0n && field_limit_0.value <= 18446744073709551615n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 8 (argument 9 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'struct Maybe<is_some: Boolean, value: Uint<0..18446744073709551616>>',
                                 field_limit_0)
    }
    if (!(typeof(enable_subdomains_0) === 'boolean')) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 9 (argument 10 as invoked from Typescript)',
                                 'ns.compact line 81 char 1',
                                 'Boolean',
                                 enable_subdomains_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('change_root_enable_subdomains', new __compactRuntime.ContractOperation());
    state_0.setOperation('change_field_limit', new __compactRuntime.ContractOperation());
    state_0.setOperation('create_domain', new __compactRuntime.ContractOperation());
    state_0.setOperation('update_target', new __compactRuntime.ContractOperation());
    state_0.setOperation('update_payment_config', new __compactRuntime.ContractOperation());
    state_0.setOperation('transfer_domain', new __compactRuntime.ContractOperation());
    state_0.setOperation('add_domain_field', new __compactRuntime.ContractOperation());
    state_0.setOperation('add_multiple_fields', new __compactRuntime.ContractOperation());
    state_0.setOperation('remove_domain_field', new __compactRuntime.ContractOperation());
    state_0.setOperation('clear_domain_fields', new __compactRuntime.ContractOperation());
    state_0.setOperation('update_domain_default_field', new __compactRuntime.ContractOperation());
    state_0.setOperation('lock_target', new __compactRuntime.ContractOperation());
    state_0.setOperation('lock_payment_config', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext('constructor', __compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(''),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(4n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(5n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(7n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(false),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue({ is_some: false, value: 0n }),
                                                                                              alignment: _descriptor_19.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tld_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(2n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_18.toValue(tmp_1),
                                                                alignment: _descriptor_18.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(field_limit_0),
                                                                                              alignment: _descriptor_19.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(7n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(enable_subdomains_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const root_data_0 = { owner_public_key:
                            await this._derive_public_key_0(context,
                                                            partialProofData),
                          owner_address: owner_address_0,
                          target: target_0,
                          target_type: target_type_0,
                          default_field: default_field_0,
                          payment_config: payment_config_0,
                          target_locked: false,
                          payment_config_locked: false };
    const root_ref_0 = { domain: new Uint8Array(32), parent_id: 0n };
    const root_owner_0 = await this._derive_public_key_0(context,
                                                         partialProofData);
    const tmp_2 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(4n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_2),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(root_data_0),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_3 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(3n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(root_ref_0),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_3),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(root_owner_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(root_owner_0),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(root_ref_0),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    await this._folder_0(context,
                         partialProofData,
                         (async (context, partialProofData, t_0, kv_0) =>
                          {
                            if (!this._equal_0(kv_0, this._none_0())) {
                              let tmp_4;
                              if (!(tmp_4 = 0n,
                                    _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(6n),
                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                               { push: { storage: false,
                                                                                                         value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_4),
                                                                                                                                                      alignment: _descriptor_4.alignment() }).encode() } },
                                                                                               'member',
                                                                                               { popeq: { cached: true,
                                                                                                          result: undefined } }]).value)))
                              {
                                const tmp_5 = 0n;
                                __compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { idx: { cached: false,
                                                                            pushPath: true,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_5),
                                                                                                                          alignment: _descriptor_4.alignment() }).encode() } },
                                                                   { push: { storage: true,
                                                                             value: __compactRuntime.StateValue.newMap(
                                                                                      new __compactRuntime.StateMap()
                                                                                    ).encode() } },
                                                                   { ins: { cached: false,
                                                                            n: 1 } },
                                                                   { ins: { cached: true,
                                                                            n: 1 } }]);
                              }
                              const tmp_6 = kv_0.value[0];
                              const tmp_7 = kv_0.value[1];
                              const tmp_8 = 0n;
                              __compactRuntime.queryLedgerState(context,
                                                                partialProofData,
                                                                [
                                                                 { idx: { cached: false,
                                                                          pushPath: true,
                                                                          path: [
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_2.toValue(6n),
                                                                                            alignment: _descriptor_2.alignment() } },
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_4.toValue(tmp_8),
                                                                                            alignment: _descriptor_4.alignment() } }] } },
                                                                 { push: { storage: false,
                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_6),
                                                                                                                        alignment: _descriptor_8.alignment() }).encode() } },
                                                                 { push: { storage: true,
                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_7),
                                                                                                                        alignment: _descriptor_8.alignment() }).encode() } },
                                                                 { ins: { cached: false,
                                                                          n: 1 } },
                                                                 { ins: { cached: true,
                                                                          n: 2 } }]);
                            }
                            return t_0;
                          }),
                         [],
                         kvs_0);
    state_0.data = new __compactRuntime.ChargedState(context.callContext.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.callContext.currentPrivateState,
      currentZswapLocalState: context.callContext.currentZswapLocalState
    }
  }
  _none_0() { return { is_some: false, value: ['', ''] }; }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: new Uint8Array(32) };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  async _sendUnshielded_0(context,
                          partialProofData,
                          color_0,
                          amount_0,
                          recipient_0)
  {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(7n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_21.toValue(tmp_0),
                                                                                              alignment: _descriptor_21.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(amount_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    const tmp_1 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(8n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_21.toValue(tmp_1),
                                                                                                alignment: _descriptor_21.alignment() },
                                                                                              { value: _descriptor_23.toValue(recipient_0),
                                                                                                alignment: _descriptor_23.alignment() }
                                                                                            )).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(amount_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (recipient_0.is_left
        &&
        this._equal_1(recipient_0.left.bytes,
                      _descriptor_22.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_0(color_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(6n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_21.toValue(tmp_2),
                                                                                                alignment: _descriptor_21.alignment() }).encode() } },
                                         { dup: { n: 1 } },
                                         { dup: { n: 1 } },
                                         'member',
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(amount_0),
                                                                                                alignment: _descriptor_10.alignment() }).encode() } },
                                         { swap: { n: 0 } },
                                         'neg',
                                         { branch: { skip: 4 } },
                                         { dup: { n: 2 } },
                                         { dup: { n: 2 } },
                                         { idx: { cached: true,
                                                  pushPath: false,
                                                  path: [ { tag: 'stack' }] } },
                                         'add',
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return [];
  }
  async _receiveUnshielded_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(6n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_21.toValue(tmp_0),
                                                                                              alignment: _descriptor_21.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(amount_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_20, value_0);
    return result_0;
  }
  _domainSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.domainSecretKey(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('domainSecretKey',
                                 'return value',
                                 'ns.compact line 19 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_5.toValue(result_0),
      alignment: _descriptor_5.alignment()
    });
    return result_0;
  }
  async _change_root_enable_subdomains_0(context, partialProofData, b_0) {
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(7n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(b_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  async _change_field_limit_0(context, partialProofData, val_0) {
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(val_0),
                                                                                              alignment: _descriptor_19.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  async _assert_enabled_to_purchase_subdomains_0(context,
                                                 partialProofData,
                                                 parent_id_0)
  {
    if (parent_id_0
        ===
        _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                   { popeq: { cached: false,
                                                                              result: undefined } }]).value))
    {
    } else {
      __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_2.toValue(7n),
                                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                                         { popeq: { cached: false,
                                                                                                    result: undefined } }]).value),
                              'Subdomains are disabled.');
    }
    return [];
  }
  async _assert_field_limit_not_reached_0(context, partialProofData, id_0) {
    if (_descriptor_19.fromValue(__compactRuntime.queryLedgerState(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_2.toValue(8n),
                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                    { popeq: { cached: false,
                                                                               result: undefined } }]).value).is_some)
    {
      let t_0;
      __compactRuntime.assert((t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                               partialProofData,
                                                                                               [
                                                                                                { dup: { n: 0 } },
                                                                                                { idx: { cached: false,
                                                                                                         pushPath: false,
                                                                                                         path: [
                                                                                                                { tag: 'value',
                                                                                                                  value: { value: _descriptor_2.toValue(6n),
                                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                                { tag: 'value',
                                                                                                                  value: { value: _descriptor_4.toValue(id_0),
                                                                                                                           alignment: _descriptor_4.alignment() } }] } },
                                                                                                'size',
                                                                                                { popeq: { cached: true,
                                                                                                           result: undefined } }]).value),
                               t_0
                               <
                               _descriptor_19.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(8n),
                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value).value),
                              'Max amount of fields would be exceeded');
    }
    return [];
  }
  async _get_and_inc_id_0(context, partialProofData) {
    const i_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(2n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(2n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_18.toValue(tmp_0),
                                                                alignment: _descriptor_18.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return i_0;
  }
  async __update_domain_0(context, partialProofData, id_0, data_0) {
    const current_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(4n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_4.toValue(id_0),
                                                                                                             alignment: _descriptor_4.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(!current_0.target_locked || data_0.target_locked,
                            'Cannot unlock a locked target');
    __compactRuntime.assert(!current_0.payment_config_locked
                            ||
                            data_0.payment_config_locked,
                            'Cannot unlock payment config');
    __compactRuntime.assert(!current_0.target_locked
                            ||
                            this._equal_2(data_0.target, current_0.target),
                            'Target is locked');
    __compactRuntime.assert(!current_0.target_locked
                            ||
                            data_0.target_type === current_0.target_type,
                            'Target type is locked');
    __compactRuntime.assert(!current_0.payment_config_locked
                            ||
                            this._equal_3(data_0.payment_config,
                                          current_0.payment_config),
                            'Payment config is locked');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(4n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(id_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(data_0),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _check_domain_ownership_0(context, partialProofData, id_0) {
    const owner_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(4n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_4.toValue(id_0),
                                                                                                           alignment: _descriptor_4.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value).owner_public_key;
    __compactRuntime.assert(this._equal_4(owner_0,
                                          await this._derive_public_key_0(context,
                                                                          partialProofData)),
                            'Not the owner');
    return [];
  }
  async _derive_public_key_0(context, partialProofData) {
    const tag_0 = new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 46, 100, 111, 109, 97, 105, 110, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return this._persistentHash_0([tag_0,
                                   this._domainSecretKey_0(context,
                                                           partialProofData)]);
  }
  async _create_domain_0(context,
                         partialProofData,
                         owner_address_0,
                         domain_0,
                         len_0,
                         parent_id_0,
                         target_0,
                         target_type_0,
                         default_field_0,
                         payment_config_0,
                         kvs_0)
  {
    await this._assert_enabled_to_purchase_subdomains_0(context,
                                                        partialProofData,
                                                        parent_id_0);
    __compactRuntime.assert(len_0 <= 32n, 'len must be <= 32');
    __compactRuntime.assert(len_0 >= 1n, 'domain name cannot be empty');
    const valid_0 = this._verify_domain_path_0(domain_0, len_0);
    __compactRuntime.assert(valid_0, 'Invalid domain key padding');
    const parent_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(4n),
                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_4.toValue(parent_id_0),
                                                                                                            alignment: _descriptor_4.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const dom_ref_0 = { domain: domain_0, parent_id: parent_id_0 };
    __compactRuntime.assert(!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(3n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(dom_ref_0),
                                                                                                                                               alignment: _descriptor_17.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'This (sub)domain already exists');
    if (this._equal_5(await this._derive_public_key_0(context, partialProofData),
                      parent_0.owner_public_key))
    {
    } else {
      __compactRuntime.assert(parent_0.payment_config.buy_enabled,
                              'buying domains is not enabled');
      const d_len_0 = len_0;
      if (d_len_0 <= 3n) {
        await this._receiveUnshielded_0(context,
                                        partialProofData,
                                        parent_0.payment_config.coin_color,
                                        parent_0.payment_config.cost_short);
        await this._sendUnshielded_0(context,
                                     partialProofData,
                                     parent_0.payment_config.coin_color,
                                     parent_0.payment_config.cost_short,
                                     this._right_0(parent_0.owner_address));
      } else {
        if (d_len_0 === 4n) {
          await this._receiveUnshielded_0(context,
                                          partialProofData,
                                          parent_0.payment_config.coin_color,
                                          parent_0.payment_config.cost_med);
          await this._sendUnshielded_0(context,
                                       partialProofData,
                                       parent_0.payment_config.coin_color,
                                       parent_0.payment_config.cost_med,
                                       this._right_0(parent_0.owner_address));
        } else {
          await this._receiveUnshielded_0(context,
                                          partialProofData,
                                          parent_0.payment_config.coin_color,
                                          parent_0.payment_config.cost_long);
          await this._sendUnshielded_0(context,
                                       partialProofData,
                                       parent_0.payment_config.coin_color,
                                       parent_0.payment_config.cost_long,
                                       this._right_0(parent_0.owner_address));
        }
      }
    }
    const new_id_0 = await this._get_and_inc_id_0(context, partialProofData);
    const d_owner_0 = await this._derive_public_key_0(context, partialProofData);
    const data_0 = { owner_public_key: d_owner_0,
                     owner_address: owner_address_0,
                     target: target_0,
                     target_type: target_type_0,
                     default_field: default_field_0,
                     payment_config: payment_config_0,
                     target_locked: false,
                     payment_config_locked: false };
    if (!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_2.toValue(5n),
                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                    { push: { storage: false,
                                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(d_owner_0),
                                                                                                                           alignment: _descriptor_5.alignment() }).encode() } },
                                                                    'member',
                                                                    { popeq: { cached: true,
                                                                               result: undefined } }]).value))
    {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(5n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(d_owner_0),
                                                                                                alignment: _descriptor_5.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newMap(
                                                            new __compactRuntime.StateMap()
                                                          ).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(d_owner_0),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(dom_ref_0),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(3n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(dom_ref_0),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(new_id_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(4n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(new_id_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(data_0),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await this._folder_1(context,
                         partialProofData,
                         (async (context, partialProofData, t_0, kv_0) =>
                          {
                            if (!this._equal_6(kv_0, this._none_0())) {
                              if (!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(6n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { push: { storage: false,
                                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(new_id_0),
                                                                                                                                                     alignment: _descriptor_4.alignment() }).encode() } },
                                                                                              'member',
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value))
                              {
                                __compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { idx: { cached: false,
                                                                            pushPath: true,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(new_id_0),
                                                                                                                          alignment: _descriptor_4.alignment() }).encode() } },
                                                                   { push: { storage: true,
                                                                             value: __compactRuntime.StateValue.newMap(
                                                                                      new __compactRuntime.StateMap()
                                                                                    ).encode() } },
                                                                   { ins: { cached: false,
                                                                            n: 1 } },
                                                                   { ins: { cached: true,
                                                                            n: 1 } }]);
                              }
                              const tmp_0 = kv_0.value[0];
                              const tmp_1 = kv_0.value[1];
                              __compactRuntime.queryLedgerState(context,
                                                                partialProofData,
                                                                [
                                                                 { idx: { cached: false,
                                                                          pushPath: true,
                                                                          path: [
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_2.toValue(6n),
                                                                                            alignment: _descriptor_2.alignment() } },
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_4.toValue(new_id_0),
                                                                                            alignment: _descriptor_4.alignment() } }] } },
                                                                 { push: { storage: false,
                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                                                        alignment: _descriptor_8.alignment() }).encode() } },
                                                                 { push: { storage: true,
                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_1),
                                                                                                                        alignment: _descriptor_8.alignment() }).encode() } },
                                                                 { ins: { cached: false,
                                                                          n: 1 } },
                                                                 { ins: { cached: true,
                                                                          n: 2 } }]);
                            }
                            return t_0;
                          }),
                         [],
                         kvs_0);
    return [];
  }
  async _update_target_0(context,
                         partialProofData,
                         id_0,
                         target_0,
                         target_type_0)
  {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    const current_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(4n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_4.toValue(id_0),
                                                                                                             alignment: _descriptor_4.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(!current_0.target_locked, 'Target is locked');
    const updated_0 = { owner_public_key: current_0.owner_public_key,
                        owner_address: current_0.owner_address,
                        target: target_0,
                        target_type: target_type_0,
                        default_field: current_0.default_field,
                        payment_config: current_0.payment_config,
                        target_locked: current_0.target_locked,
                        payment_config_locked: current_0.payment_config_locked };
    await this.__update_domain_0(context, partialProofData, id_0, updated_0);
    return [];
  }
  async _update_payment_config_0(context, partialProofData, id_0, pc_0) {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    const current_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(4n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_4.toValue(id_0),
                                                                                                             alignment: _descriptor_4.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(!current_0.payment_config_locked,
                            'Payment config is locked');
    const updated_0 = { owner_public_key: current_0.owner_public_key,
                        owner_address: current_0.owner_address,
                        target: current_0.target,
                        target_type: current_0.target_type,
                        default_field: current_0.default_field,
                        payment_config: pc_0,
                        target_locked: current_0.target_locked,
                        payment_config_locked: current_0.payment_config_locked };
    await this.__update_domain_0(context, partialProofData, id_0, updated_0);
    return [];
  }
  async _transfer_domain_0(context,
                           partialProofData,
                           domain_0,
                           parent_id_0,
                           new_owner_0,
                           new_owner_address_0)
  {
    const dom_ref_0 = { domain: domain_0, parent_id: parent_id_0 };
    const dom_id_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(3n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_17.toValue(dom_ref_0),
                                                                                                           alignment: _descriptor_17.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    await this._check_domain_ownership_0(context, partialProofData, dom_id_0);
    const old_data_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(4n),
                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_4.toValue(dom_id_0),
                                                                                                              alignment: _descriptor_4.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value);
    const new_data_0 = { owner_public_key: new_owner_0,
                         owner_address: new_owner_address_0,
                         target: old_data_0.target,
                         target_type: old_data_0.target_type,
                         default_field: old_data_0.default_field,
                         payment_config: old_data_0.payment_config,
                         target_locked: old_data_0.target_locked,
                         payment_config_locked: old_data_0.payment_config_locked };
    const tmp_0 = await this._derive_public_key_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(tmp_0),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(dom_ref_0),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    if (!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_2.toValue(5n),
                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                    { push: { storage: false,
                                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(new_owner_0),
                                                                                                                           alignment: _descriptor_5.alignment() }).encode() } },
                                                                    'member',
                                                                    { popeq: { cached: true,
                                                                               result: undefined } }]).value))
    {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(5n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(new_owner_0),
                                                                                                alignment: _descriptor_5.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newMap(
                                                            new __compactRuntime.StateMap()
                                                          ).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(new_owner_0),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(dom_ref_0),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    await this.__update_domain_0(context, partialProofData, dom_id_0, new_data_0);
    return [];
  }
  async _add_domain_field_0(context, partialProofData, id_0, k_0, v_0) {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    if (!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_2.toValue(6n),
                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                    { push: { storage: false,
                                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(id_0),
                                                                                                                           alignment: _descriptor_4.alignment() }).encode() } },
                                                                    'member',
                                                                    { popeq: { cached: true,
                                                                               result: undefined } }]).value))
    {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(6n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(id_0),
                                                                                                alignment: _descriptor_4.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newMap(
                                                            new __compactRuntime.StateMap()
                                                          ).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(6n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(id_0),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(k_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(v_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    await this._assert_field_limit_not_reached_0(context, partialProofData, id_0);
    return [];
  }
  async _add_multiple_fields_0(context, partialProofData, id_0, kvs_0) {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    await this._folder_2(context,
                         partialProofData,
                         (async (context, partialProofData, t_0, kv_0) =>
                          {
                            if (!this._equal_7(kv_0, this._none_0())) {
                              if (!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(6n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { push: { storage: false,
                                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(id_0),
                                                                                                                                                     alignment: _descriptor_4.alignment() }).encode() } },
                                                                                              'member',
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value))
                              {
                                __compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { idx: { cached: false,
                                                                            pushPath: true,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(id_0),
                                                                                                                          alignment: _descriptor_4.alignment() }).encode() } },
                                                                   { push: { storage: true,
                                                                             value: __compactRuntime.StateValue.newMap(
                                                                                      new __compactRuntime.StateMap()
                                                                                    ).encode() } },
                                                                   { ins: { cached: false,
                                                                            n: 1 } },
                                                                   { ins: { cached: true,
                                                                            n: 1 } }]);
                              }
                              const tmp_0 = kv_0.value[0];
                              const tmp_1 = kv_0.value[1];
                              __compactRuntime.queryLedgerState(context,
                                                                partialProofData,
                                                                [
                                                                 { idx: { cached: false,
                                                                          pushPath: true,
                                                                          path: [
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_2.toValue(6n),
                                                                                            alignment: _descriptor_2.alignment() } },
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_4.toValue(id_0),
                                                                                            alignment: _descriptor_4.alignment() } }] } },
                                                                 { push: { storage: false,
                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                                                        alignment: _descriptor_8.alignment() }).encode() } },
                                                                 { push: { storage: true,
                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_1),
                                                                                                                        alignment: _descriptor_8.alignment() }).encode() } },
                                                                 { ins: { cached: false,
                                                                          n: 1 } },
                                                                 { ins: { cached: true,
                                                                          n: 2 } }]);
                            }
                            return t_0;
                          }),
                         [],
                         kvs_0);
    await this._assert_field_limit_not_reached_0(context, partialProofData, id_0);
    return [];
  }
  async _remove_domain_field_0(context, partialProofData, id_0, k_0) {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(6n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(id_0),
                                                                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Domain has no fields');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(6n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(id_0),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(k_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  async _clear_domain_fields_0(context, partialProofData, id_0) {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    if (_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(id_0),
                                                                                                                          alignment: _descriptor_4.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value))
    {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(6n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(id_0),
                                                                                                alignment: _descriptor_4.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    return [];
  }
  async _update_domain_default_field_0(context, partialProofData, id_0, d_0) {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    const current_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(4n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_4.toValue(id_0),
                                                                                                             alignment: _descriptor_4.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    const updated_0 = { owner_public_key: current_0.owner_public_key,
                        owner_address: current_0.owner_address,
                        target: current_0.target,
                        target_type: current_0.target_type,
                        default_field: d_0,
                        payment_config: current_0.payment_config,
                        target_locked: current_0.target_locked,
                        payment_config_locked: current_0.payment_config_locked };
    await this.__update_domain_0(context, partialProofData, id_0, updated_0);
    return [];
  }
  async _lock_target_0(context, partialProofData, id_0) {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    const current_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(4n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_4.toValue(id_0),
                                                                                                             alignment: _descriptor_4.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    const updated_0 = { owner_public_key: current_0.owner_public_key,
                        owner_address: current_0.owner_address,
                        target: current_0.target,
                        target_type: current_0.target_type,
                        default_field: current_0.default_field,
                        payment_config: current_0.payment_config,
                        target_locked: true,
                        payment_config_locked: current_0.payment_config_locked };
    await this.__update_domain_0(context, partialProofData, id_0, updated_0);
    return [];
  }
  async _lock_payment_config_0(context, partialProofData, id_0) {
    await this._check_domain_ownership_0(context, partialProofData, id_0);
    const current_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(4n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_4.toValue(id_0),
                                                                                                             alignment: _descriptor_4.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    const updated_0 = { owner_public_key: current_0.owner_public_key,
                        owner_address: current_0.owner_address,
                        target: current_0.target,
                        target_type: current_0.target_type,
                        default_field: current_0.default_field,
                        payment_config: current_0.payment_config,
                        target_locked: current_0.target_locked,
                        payment_config_locked: true };
    await this.__update_domain_0(context, partialProofData, id_0, updated_0);
    return [];
  }
  _verify_domain_path_0(domain_0, len_0) {
    return this._folder_3(((acc_0, byte_0, i_0) =>
                           {
                             return acc_0
                                    &&
                                    (i_0 < len_0
                                     &&
                                     (this._is_letter_0(byte_0)
                                      ||
                                      this._is_number_0(byte_0)
                                      ||
                                      this._is_hyphen_0(byte_0))
                                     &&
                                     !(i_0 === 0n && this._is_hyphen_0(byte_0))
                                     &&
                                     !(i_0
                                       ===
                                       (__compactRuntime.assert(len_0 >= 1n,
                                                                'result of subtraction would be negative'),
                                        len_0 - 1n)
                                       &&
                                       this._is_hyphen_0(byte_0))
                                     ||
                                     i_0 >= len_0 && this._is_padding_0(byte_0));
                           }),
                          true,
                          domain_0,
                          this._zero_to_31_0());
  }
  _is_letter_0(byte_0) { return 97n <= byte_0 && byte_0 <= 122n; }
  _is_number_0(byte_0) { return 48n <= byte_0 && byte_0 <= 57n; }
  _is_hyphen_0(byte_0) { return byte_0 === 45n; }
  _is_padding_0(byte_0) { return byte_0 === 255n; }
  _zero_to_31_0() {
    return [0n,
            1n,
            2n,
            3n,
            4n,
            5n,
            6n,
            7n,
            8n,
            9n,
            10n,
            11n,
            12n,
            13n,
            14n,
            15n,
            16n,
            17n,
            18n,
            19n,
            20n,
            21n,
            22n,
            23n,
            24n,
            25n,
            26n,
            27n,
            28n,
            29n,
            30n,
            31n];
  }
  _equal_0(x0, y0) {
    {
      let x1 = x0.is_some;
      let y1 = y0.is_some;
      if (x1 !== y1) { return false; }
    }
    {
      let x1 = x0.value;
      let y1 = y0.value;
      {
        let x2 = x1[0];
        let y2 = y1[0];
        if (x2 !== y2) { return false; }
      }
      {
        let x2 = x1[1];
        let y2 = y1[1];
        if (x2 !== y2) { return false; }
      }
    }
    return true;
  }
  async _folder_0(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 10; i++) { x = await f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    {
      let x1 = x0.cost_short;
      let y1 = y0.cost_short;
      if (x1 !== y1) { return false; }
    }
    {
      let x1 = x0.cost_med;
      let y1 = y0.cost_med;
      if (x1 !== y1) { return false; }
    }
    {
      let x1 = x0.cost_long;
      let y1 = y0.cost_long;
      if (x1 !== y1) { return false; }
    }
    {
      let x1 = x0.coin_color;
      let y1 = y0.coin_color;
      if (!x1.every((x, i) => y1[i] === x)) { return false; }
    }
    {
      let x1 = x0.buy_enabled;
      let y1 = y0.buy_enabled;
      if (x1 !== y1) { return false; }
    }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    {
      let x1 = x0.is_some;
      let y1 = y0.is_some;
      if (x1 !== y1) { return false; }
    }
    {
      let x1 = x0.value;
      let y1 = y0.value;
      {
        let x2 = x1[0];
        let y2 = y1[0];
        if (x2 !== y2) { return false; }
      }
      {
        let x2 = x1[1];
        let y2 = y1[1];
        if (x2 !== y2) { return false; }
      }
    }
    return true;
  }
  async _folder_1(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 10; i++) { x = await f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _equal_7(x0, y0) {
    {
      let x1 = x0.is_some;
      let y1 = y0.is_some;
      if (x1 !== y1) { return false; }
    }
    {
      let x1 = x0.value;
      let y1 = y0.value;
      {
        let x2 = x1[0];
        let y2 = y1[0];
        if (x2 !== y2) { return false; }
      }
      {
        let x2 = x1[1];
        let y2 = y1[1];
        if (x2 !== y2) { return false; }
      }
    }
    return true;
  }
  async _folder_2(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 10; i++) { x = await f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _folder_3(f, x, a0, a1) {
    for (let i = 0; i < 32; i++) { x = f(x, BigInt(a0[i]), a1[i]); }
    return x;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    callContext: { currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() },
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get ROOT_ZONE_ID() {
      return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get TLD() {
      return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get last_id_int() {
      return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(2n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    name_to_id: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'object' && key_0.domain.buffer instanceof ArrayBuffer && key_0.domain.BYTES_PER_ELEMENT === 1 && key_0.domain.length === 32 && typeof(key_0.parent_id) === 'bigint' && key_0.parent_id >= 0n && key_0.parent_id <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ns.compact line 11 char 1',
                                     'struct DomainReference<domain: Bytes<32>, parent_id: Uint<0..18446744073709551616>>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(key_0),
                                                                                                                                 alignment: _descriptor_17.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'object' && key_0.domain.buffer instanceof ArrayBuffer && key_0.domain.BYTES_PER_ELEMENT === 1 && key_0.domain.length === 32 && typeof(key_0.parent_id) === 'bigint' && key_0.parent_id >= 0n && key_0.parent_id <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ns.compact line 11 char 1',
                                     'struct DomainReference<domain: Bytes<32>, parent_id: Uint<0..18446744073709551616>>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(key_0),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_17.fromValue(key.value),      _descriptor_4.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    id_to_data: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ns.compact line 13 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(key_0),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ns.compact line 13 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(4n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_4.toValue(key_0),
                                                                                                      alignment: _descriptor_4.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_4.fromValue(key.value),      _descriptor_12.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    addr_to_domains: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ns.compact line 15 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(key_0),
                                                                                                                                 alignment: _descriptor_5.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ns.compact line 15 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        if (state.asArray()[5].asMap().get({ value: _descriptor_5.toValue(key_0),
                                             alignment: _descriptor_5.alignment() }) === undefined) {
          throw new __compactRuntime.CompactError(`Map value undefined for ${key_0}`);
        }
        return {
          isEmpty(...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_1.length}`);
            }
            return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(5n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_5.toValue(key_0),
                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                              'size',
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                     alignment: _descriptor_4.alignment() }).encode() } },
                                                                              'eq',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          size(...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_1.length}`);
            }
            return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(5n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_5.toValue(key_0),
                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                              'size',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          member(...args_1) {
            if (args_1.length !== 1) {
              throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_1.length}`);
            }
            const elem_0 = args_1[0];
            if (!(typeof(elem_0) === 'object' && elem_0.domain.buffer instanceof ArrayBuffer && elem_0.domain.BYTES_PER_ELEMENT === 1 && elem_0.domain.length === 32 && typeof(elem_0.parent_id) === 'bigint' && elem_0.parent_id >= 0n && elem_0.parent_id <= 18446744073709551615n)) {
              __compactRuntime.typeError('member',
                                         'argument 1',
                                         'ns.compact line 15 char 47',
                                         'struct DomainReference<domain: Bytes<32>, parent_id: Uint<0..18446744073709551616>>',
                                         elem_0)
            }
            return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(5n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_5.toValue(key_0),
                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(elem_0),
                                                                                                                                     alignment: _descriptor_17.alignment() }).encode() } },
                                                                              'member',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          [Symbol.iterator](...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_1.length}`);
            }
            const self_0 = state.asArray()[5].asMap().get({ value: _descriptor_5.toValue(key_0),
                                                            alignment: _descriptor_5.alignment() });
            return self_0.asMap().keys().map((elem) => _descriptor_17.fromValue(elem.value))[Symbol.iterator]();
          }
        }
      }
    },
    domain_fields: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(6n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(6n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ns.compact line 17 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(6n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(key_0),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ns.compact line 17 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        if (state.asArray()[6].asMap().get({ value: _descriptor_4.toValue(key_0),
                                             alignment: _descriptor_4.alignment() }) === undefined) {
          throw new __compactRuntime.CompactError(`Map value undefined for ${key_0}`);
        }
        return {
          isEmpty(...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_1.length}`);
            }
            return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(6n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_4.toValue(key_0),
                                                                                                         alignment: _descriptor_4.alignment() } }] } },
                                                                              'size',
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                     alignment: _descriptor_4.alignment() }).encode() } },
                                                                              'eq',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          size(...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_1.length}`);
            }
            return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(6n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_4.toValue(key_0),
                                                                                                         alignment: _descriptor_4.alignment() } }] } },
                                                                              'size',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          member(...args_1) {
            if (args_1.length !== 1) {
              throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_1.length}`);
            }
            const key_1 = args_1[0];
            if (!(typeof (key_1) === 'string')) {
              __compactRuntime.typeError('member',
                                         'argument 1',
                                         'ns.compact line 17 char 44',
                                         'Opaque<"string">',
                                         key_1)
            }
            return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(6n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_4.toValue(key_0),
                                                                                                         alignment: _descriptor_4.alignment() } }] } },
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(key_1),
                                                                                                                                     alignment: _descriptor_8.alignment() }).encode() } },
                                                                              'member',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          lookup(...args_1) {
            if (args_1.length !== 1) {
              throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_1.length}`);
            }
            const key_1 = args_1[0];
            if (!(typeof (key_1) === 'string')) {
              __compactRuntime.typeError('lookup',
                                         'argument 1',
                                         'ns.compact line 17 char 44',
                                         'Opaque<"string">',
                                         key_1)
            }
            return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(6n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_4.toValue(key_0),
                                                                                                         alignment: _descriptor_4.alignment() } }] } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_8.toValue(key_1),
                                                                                                         alignment: _descriptor_8.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value);
          },
          [Symbol.iterator](...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_1.length}`);
            }
            const self_0 = state.asArray()[6].asMap().get({ value: _descriptor_4.toValue(key_0),
                                                            alignment: _descriptor_4.alignment() });
            return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_8.fromValue(key.value),      _descriptor_8.fromValue(value.value)    ];  })[Symbol.iterator]();
          }
        }
      }
    },
    get ENABLE_SUBDOMAINS() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(7n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get FIELD_LIMIT() {
      return _descriptor_19.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_2.toValue(8n),
                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  callContext: { currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() }
};
const _dummyContract = new Contract({
  domainSecretKey: (...args) => undefined
});
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
export const expectedVk = {
  'add_domain_field': '771169b109ab423407d3b1cc061ef14b7a81bac653782143afd0bf3df4da7f80',
  'add_multiple_fields': 'ac2f4e7feb2c0fb483d653c6cba5f10e757664c54801def3d0e7760ac2cf6385',
  'change_field_limit': '0d3ca471eaa520babeca7c152ae225c397d77085e353af96308341e81844469d',
  'change_root_enable_subdomains': '2135e7887ccfdb7496be9ea9bdefff75fae3c3ed59a7310dfa6186ffc65d32dd',
  'clear_domain_fields': '28c7e1c2114f625a58b313b5bdcd9d385d2e62953098ad5dc959f902803b92f7',
  'create_domain': '7bd4b162abd092dac2c56c82e549df08977b4374904508dd8735eb7a5ee22b63',
  'lock_payment_config': '5347421d4551d1196a667539d83defb8704558e51b1c8cee92560021c8248f5a',
  'lock_target': '193115a178b807da70e7efe713a4f804287f67a4f6ff6a4203c130f46d351047',
  'remove_domain_field': 'e75f24d57207ccde97f7a02cdbb4fceab971560fc611120a4ad6111d882fc532',
  'transfer_domain': 'd1a03e2243c19ef3639f9208070d74b8c16575752b501fe3b9554a4936d00f59',
  'update_domain_default_field': 'ab73037aada66bfe3c036a90bc4c3a12b2cc347ea3080c5f70eeeb8c8b063f91',
  'update_payment_config': '93ea6c7d477cad92dc1ef9a5ee9a06d50cac2144afe137b93d528810e6a85572',
  'update_target': '6a0107c83d4ce07b1dbd416a7207e44055031ef6beb0fd5280475ce3b13181e3',
};


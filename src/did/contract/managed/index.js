import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.19.0');

export var VerificationMethodType;
(function (VerificationMethodType) {
  VerificationMethodType[VerificationMethodType['Undefined'] = 0] = 'Undefined';
  VerificationMethodType[VerificationMethodType['JsonWebKey'] = 1] = 'JsonWebKey';
})(VerificationMethodType || (VerificationMethodType = {}));

export var VerificationMethodRelation;
(function (VerificationMethodRelation) {
  VerificationMethodRelation[VerificationMethodRelation['Undefined'] = 0] = 'Undefined';
  VerificationMethodRelation[VerificationMethodRelation['Authentication'] = 1] = 'Authentication';
  VerificationMethodRelation[VerificationMethodRelation['AssertionMethod'] = 2] = 'AssertionMethod';
  VerificationMethodRelation[VerificationMethodRelation['KeyAgreement'] = 3] = 'KeyAgreement';
  VerificationMethodRelation[VerificationMethodRelation['CapabilityInvocation'] = 4] = 'CapabilityInvocation';
  VerificationMethodRelation[VerificationMethodRelation['CapabilityDelegation'] = 5] = 'CapabilityDelegation';
})(VerificationMethodRelation || (VerificationMethodRelation = {}));

export var MapMutation;
(function (MapMutation) {
  MapMutation[MapMutation['Undefined'] = 0] = 'Undefined';
  MapMutation[MapMutation['Insert'] = 1] = 'Insert';
  MapMutation[MapMutation['Update'] = 2] = 'Update';
})(MapMutation || (MapMutation = {}));

export var SetMutation;
(function (SetMutation) {
  SetMutation[SetMutation['Undefined'] = 0] = 'Undefined';
  SetMutation[SetMutation['Insert'] = 1] = 'Insert';
  SetMutation[SetMutation['Remove'] = 2] = 'Remove';
})(SetMutation || (SetMutation = {}));

export var KeyType;
(function (KeyType) {
  KeyType[KeyType['EC'] = 0] = 'EC';
  KeyType[KeyType['RSA'] = 1] = 'RSA';
  KeyType[KeyType['oct'] = 2] = 'oct';
  KeyType[KeyType['OKP'] = 3] = 'OKP';
})(KeyType || (KeyType = {}));

export var CurveType;
(function (CurveType) {
  CurveType[CurveType['Ed25519'] = 0] = 'Ed25519';
  CurveType[CurveType['X25519'] = 1] = 'X25519';
  CurveType[CurveType['Jubjub'] = 2] = 'Jubjub';
  CurveType[CurveType['P256'] = 3] = 'P256';
  CurveType[CurveType['Secp256k1'] = 4] = 'Secp256k1';
  CurveType[CurveType['BLS12381G1'] = 5] = 'BLS12381G1';
  CurveType[CurveType['BLS12381G2'] = 6] = 'BLS12381G2';
})(CurveType || (CurveType = {}));

const _descriptor_0 = __compactRuntime.CompactTypeOpaqueString;

class _Service_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0),
      typ: _descriptor_0.fromValue(value_0),
      serviceEndpoint: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id).concat(_descriptor_0.toValue(value_0.typ).concat(_descriptor_0.toValue(value_0.serviceEndpoint)));
  }
}

const _descriptor_1 = new _Service_0();

const _descriptor_2 = new __compactRuntime.CompactTypeBytes(32);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.bytes);
  }
}

const _descriptor_3 = new _ContractAddress_0();

const _descriptor_4 = __compactRuntime.CompactTypeBoolean;

const _descriptor_5 = __compactRuntime.CompactTypeJubjubPoint;

const _descriptor_6 = __compactRuntime.CompactTypeField;

class _SchnorrSignature_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_6.alignment());
  }
  fromValue(value_0) {
    return {
      announcement: _descriptor_5.fromValue(value_0),
      response: _descriptor_6.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.announcement).concat(_descriptor_6.toValue(value_0.response));
  }
}

const _descriptor_7 = new _SchnorrSignature_0();

const _descriptor_8 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_9 = new __compactRuntime.CompactTypeEnum(5, 1);

const _descriptor_10 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_11 = new __compactRuntime.CompactTypeEnum(2, 1);

class _SchnorrJubjubVerificationMethod_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_5.alignment());
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0),
      publicKey: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id).concat(_descriptor_5.toValue(value_0.publicKey));
  }
}

const _descriptor_12 = new _SchnorrJubjubVerificationMethod_0();

const _descriptor_13 = new __compactRuntime.CompactTypeVector(4, _descriptor_6);

const _descriptor_14 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_15 = new __compactRuntime.CompactTypeEnum(3, 1);

const _descriptor_16 = new __compactRuntime.CompactTypeEnum(6, 1);

class _PublicKeyJwk_0 {
  alignment() {
    return _descriptor_15.alignment().concat(_descriptor_16.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      kty: _descriptor_15.fromValue(value_0),
      crv: _descriptor_16.fromValue(value_0),
      x: _descriptor_0.fromValue(value_0),
      y: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_15.toValue(value_0.kty).concat(_descriptor_16.toValue(value_0.crv).concat(_descriptor_0.toValue(value_0.x).concat(_descriptor_0.toValue(value_0.y))));
  }
}

const _descriptor_17 = new _PublicKeyJwk_0();

class _VerificationMethod_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_14.alignment().concat(_descriptor_17.alignment()));
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0),
      typ: _descriptor_14.fromValue(value_0),
      publicKeyJwk: _descriptor_17.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id).concat(_descriptor_14.toValue(value_0.typ).concat(_descriptor_17.toValue(value_0.publicKeyJwk)));
  }
}

const _descriptor_18 = new _VerificationMethod_0();

const _descriptor_19 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_20 = __compactRuntime.CompactTypeField;

const _descriptor_21 = new __compactRuntime.CompactTypeUnsignedInteger(127n, 1);

const _descriptor_22 = new __compactRuntime.CompactTypeUnsignedInteger(452312848583266388373324160190187140051835877600158453279131187530910662655n, 31);

class _tuple_0 {
  alignment() {
    return _descriptor_21.alignment().concat(_descriptor_22.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_21.fromValue(value_0),
      _descriptor_22.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_21.toValue(value_0[0]).concat(_descriptor_22.toValue(value_0[1]));
  }
}

const _descriptor_23 = new _tuple_0();

class _ControllerAuthorizationNoArgs_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.domain);
  }
}

const _descriptor_24 = new _ControllerAuthorizationNoArgs_0();

class _SchnorrHashInput_0 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_6.alignment().concat(_descriptor_6.alignment().concat(_descriptor_6.alignment().concat(_descriptor_13.alignment()))));
  }
  fromValue(value_0) {
    return {
      ann_x: _descriptor_6.fromValue(value_0),
      ann_y: _descriptor_6.fromValue(value_0),
      pk_x: _descriptor_6.fromValue(value_0),
      pk_y: _descriptor_6.fromValue(value_0),
      msg: _descriptor_13.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.ann_x).concat(_descriptor_6.toValue(value_0.ann_y).concat(_descriptor_6.toValue(value_0.pk_x).concat(_descriptor_6.toValue(value_0.pk_y).concat(_descriptor_13.toValue(value_0.msg)))));
  }
}

const _descriptor_25 = new _SchnorrHashInput_0();

class _RemoveServiceArgs_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id);
  }
}

const _descriptor_26 = new _RemoveServiceArgs_0();

class _ControllerAuthorizationOperation_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      name: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.name);
  }
}

const _descriptor_27 = new _ControllerAuthorizationOperation_0();

class _SetVerificationMethodRelationArgs_0 {
  alignment() {
    return _descriptor_9.alignment().concat(_descriptor_0.alignment().concat(_descriptor_10.alignment()));
  }
  fromValue(value_0) {
    return {
      relation: _descriptor_9.fromValue(value_0),
      methodId: _descriptor_0.fromValue(value_0),
      mutation: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_9.toValue(value_0.relation).concat(_descriptor_0.toValue(value_0.methodId).concat(_descriptor_10.toValue(value_0.mutation)));
  }
}

const _descriptor_28 = new _SetVerificationMethodRelationArgs_0();

class _SetServiceArgs_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_11.alignment());
  }
  fromValue(value_0) {
    return {
      service: _descriptor_1.fromValue(value_0),
      mutation: _descriptor_11.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.service).concat(_descriptor_11.toValue(value_0.mutation));
  }
}

const _descriptor_29 = new _SetServiceArgs_0();

class _SetSchnorrJubjubVerificationMethodArgs_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_6.alignment().concat(_descriptor_11.alignment())));
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0),
      publicKeyX: _descriptor_6.fromValue(value_0),
      publicKeyY: _descriptor_6.fromValue(value_0),
      mutation: _descriptor_11.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id).concat(_descriptor_6.toValue(value_0.publicKeyX).concat(_descriptor_6.toValue(value_0.publicKeyY).concat(_descriptor_11.toValue(value_0.mutation))));
  }
}

const _descriptor_30 = new _SetSchnorrJubjubVerificationMethodArgs_0();

class _RemoveSchnorrJubjubVerificationMethodArgs_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id);
  }
}

const _descriptor_31 = new _RemoveSchnorrJubjubVerificationMethodArgs_0();

class _SetVerificationMethodArgs_0 {
  alignment() {
    return _descriptor_18.alignment().concat(_descriptor_11.alignment());
  }
  fromValue(value_0) {
    return {
      verificationMethod: _descriptor_18.fromValue(value_0),
      mutation: _descriptor_11.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_18.toValue(value_0.verificationMethod).concat(_descriptor_11.toValue(value_0.mutation));
  }
}

const _descriptor_32 = new _SetVerificationMethodArgs_0();

class _RemoveVerificationMethodArgs_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id);
  }
}

const _descriptor_33 = new _RemoveVerificationMethodArgs_0();

class _RecoverControllerKeyArgs_0 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_6.alignment());
  }
  fromValue(value_0) {
    return {
      publicKeyX: _descriptor_6.fromValue(value_0),
      publicKeyY: _descriptor_6.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.publicKeyX).concat(_descriptor_6.toValue(value_0.publicKeyY));
  }
}

const _descriptor_34 = new _RecoverControllerKeyArgs_0();

class _SetAlsoKnownAsArgs_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_10.alignment());
  }
  fromValue(value_0) {
    return {
      value: _descriptor_0.fromValue(value_0),
      mutation: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.value).concat(_descriptor_10.toValue(value_0.mutation));
  }
}

const _descriptor_35 = new _SetAlsoKnownAsArgs_0();

class _ControllerAuthorizationState_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_8.alignment());
  }
  fromValue(value_0) {
    return {
      contractId: _descriptor_3.fromValue(value_0),
      version: _descriptor_8.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.contractId).concat(_descriptor_8.toValue(value_0.version));
  }
}

const _descriptor_36 = new _ControllerAuthorizationState_0();

class _RotateControllerKeyArgs_0 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_6.alignment());
  }
  fromValue(value_0) {
    return {
      publicKeyX: _descriptor_6.fromValue(value_0),
      publicKeyY: _descriptor_6.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.publicKeyX).concat(_descriptor_6.toValue(value_0.publicKeyY));
  }
}

const _descriptor_37 = new _RotateControllerKeyArgs_0();

class _ControllerAuthorizationDomain_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.domain);
  }
}

const _descriptor_38 = new _ControllerAuthorizationDomain_0();

class _Either_0 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_4.fromValue(value_0),
      left: _descriptor_2.fromValue(value_0),
      right: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.is_left).concat(_descriptor_2.toValue(value_0.left).concat(_descriptor_2.toValue(value_0.right)));
  }
}

const _descriptor_39 = new _Either_0();

const _descriptor_40 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

const _descriptor_41 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

const _descriptor_42 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

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
    if (typeof(witnesses_0.getSchnorrReduction) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getSchnorrReduction');
    }
    if (typeof(witnesses_0.localControllerPublicKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localControllerPublicKey');
    }
    if (typeof(witnesses_0.localRecoveryAuthorityPublicKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localRecoveryAuthorityPublicKey');
    }
    if (typeof(witnesses_0.currentTimestamp) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named currentTimestamp');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      async controllerAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.controllerAuthorizationDigest(...args_1), context };
      },
      async rotateControllerKeyAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.rotateControllerKeyAuthorizationDigest(...args_1), context };
      },
      async recoverControllerKeyAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.recoverControllerKeyAuthorizationDigest(...args_1), context };
      },
      async setAlsoKnownAsAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.setAlsoKnownAsAuthorizationDigest(...args_1), context };
      },
      async setVerificationMethodAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.setVerificationMethodAuthorizationDigest(...args_1), context };
      },
      async removeVerificationMethodAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.removeVerificationMethodAuthorizationDigest(...args_1), context };
      },
      async setSchnorrJubjubVerificationMethodAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.setSchnorrJubjubVerificationMethodAuthorizationDigest(...args_1), context };
      },
      async removeSchnorrJubjubVerificationMethodAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.removeSchnorrJubjubVerificationMethodAuthorizationDigest(...args_1), context };
      },
      async setVerificationMethodRelationAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.setVerificationMethodRelationAuthorizationDigest(...args_1), context };
      },
      async setServiceAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.setServiceAuthorizationDigest(...args_1), context };
      },
      async removeServiceAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.removeServiceAuthorizationDigest(...args_1), context };
      },
      async deactivateAuthorizationDigest(context, ...args_1) {
        return { result: pureCircuits.deactivateAuthorizationDigest(...args_1), context };
      },
      rotateControllerKey: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`rotateControllerKey: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const newControllerPublicKey_0 = args_1[1];
        const controllerSignature_0 = args_1[2];
        const expectedVersion_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('rotateControllerKey',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 577 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(newControllerPublicKey_0.x) === 'bigint' && typeof(newControllerPublicKey_0.y) === 'bigint')) {
          __compactRuntime.typeError('rotateControllerKey',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 577 char 1',
                                     'JubjubPoint',
                                     newControllerPublicKey_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('rotateControllerKey',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 577 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('rotateControllerKey',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 577 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(newControllerPublicKey_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0))),
            alignment: _descriptor_5.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._rotateControllerKey_0(context,
                                                           partialProofData,
                                                           newControllerPublicKey_0,
                                                           controllerSignature_0,
                                                           expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      recoverControllerKey: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`recoverControllerKey: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const newControllerPublicKey_0 = args_1[1];
        const recoverySignature_0 = args_1[2];
        const expectedVersion_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('recoverControllerKey',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 595 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(newControllerPublicKey_0.x) === 'bigint' && typeof(newControllerPublicKey_0.y) === 'bigint')) {
          __compactRuntime.typeError('recoverControllerKey',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 595 char 1',
                                     'JubjubPoint',
                                     newControllerPublicKey_0)
        }
        if (!(typeof(recoverySignature_0) === 'object' && typeof(recoverySignature_0.announcement.x) === 'bigint' && typeof(recoverySignature_0.announcement.y) === 'bigint' && typeof(recoverySignature_0.response) === 'bigint' && recoverySignature_0.response >= 0 && recoverySignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('recoverControllerKey',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 595 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     recoverySignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('recoverControllerKey',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 595 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(newControllerPublicKey_0).concat(_descriptor_7.toValue(recoverySignature_0).concat(_descriptor_8.toValue(expectedVersion_0))),
            alignment: _descriptor_5.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._recoverControllerKey_0(context,
                                                            partialProofData,
                                                            newControllerPublicKey_0,
                                                            recoverySignature_0,
                                                            expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      setAlsoKnownAs: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`setAlsoKnownAs: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const value_0 = args_1[1];
        const mutation_0 = args_1[2];
        const controllerSignature_0 = args_1[3];
        const expectedVersion_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setAlsoKnownAs',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 613 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof (value_0) === 'string')) {
          __compactRuntime.typeError('setAlsoKnownAs',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 613 char 1',
                                     'Opaque<"string">',
                                     value_0)
        }
        if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
          __compactRuntime.typeError('setAlsoKnownAs',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 613 char 1',
                                     'Enum<SetMutation, Undefined, Insert, Remove>',
                                     mutation_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('setAlsoKnownAs',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 613 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('setAlsoKnownAs',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'did.compact line 613 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(value_0).concat(_descriptor_10.toValue(mutation_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_10.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._setAlsoKnownAs_0(context,
                                                      partialProofData,
                                                      value_0,
                                                      mutation_0,
                                                      controllerSignature_0,
                                                      expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      setVerificationMethod: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`setVerificationMethod: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const verificationMethod_0 = args_1[1];
        const mutation_0 = args_1[2];
        const controllerSignature_0 = args_1[3];
        const expectedVersion_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setVerificationMethod',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 638 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(verificationMethod_0) === 'object' && typeof (verificationMethod_0.id) === 'string' && typeof(verificationMethod_0.typ) === 'number' && verificationMethod_0.typ >= 0 && verificationMethod_0.typ <= 1 && typeof(verificationMethod_0.publicKeyJwk) === 'object' && typeof(verificationMethod_0.publicKeyJwk.kty) === 'number' && verificationMethod_0.publicKeyJwk.kty >= 0 && verificationMethod_0.publicKeyJwk.kty <= 3 && typeof(verificationMethod_0.publicKeyJwk.crv) === 'number' && verificationMethod_0.publicKeyJwk.crv >= 0 && verificationMethod_0.publicKeyJwk.crv <= 6 && typeof (verificationMethod_0.publicKeyJwk.x) === 'string' && typeof (verificationMethod_0.publicKeyJwk.y) === 'string')) {
          __compactRuntime.typeError('setVerificationMethod',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 638 char 1',
                                     'struct VerificationMethod<id: Opaque<"string">, typ: Enum<VerificationMethodType, Undefined, JsonWebKey>, publicKeyJwk: struct PublicKeyJwk<kty: Enum<KeyType, EC, RSA, oct, OKP>, crv: Enum<CurveType, Ed25519, X25519, Jubjub, P256, Secp256k1, BLS12381G1, BLS12381G2>, x: Opaque<"string">, y: Opaque<"string">>>',
                                     verificationMethod_0)
        }
        if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
          __compactRuntime.typeError('setVerificationMethod',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 638 char 1',
                                     'Enum<MapMutation, Undefined, Insert, Update>',
                                     mutation_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('setVerificationMethod',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 638 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('setVerificationMethod',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'did.compact line 638 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_18.toValue(verificationMethod_0).concat(_descriptor_11.toValue(mutation_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0)))),
            alignment: _descriptor_18.alignment().concat(_descriptor_11.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._setVerificationMethod_0(context,
                                                             partialProofData,
                                                             verificationMethod_0,
                                                             mutation_0,
                                                             controllerSignature_0,
                                                             expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      removeVerificationMethod: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`removeVerificationMethod: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const methodId_0 = args_1[1];
        const controllerSignature_0 = args_1[2];
        const expectedVersion_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('removeVerificationMethod',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 670 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof (methodId_0) === 'string')) {
          __compactRuntime.typeError('removeVerificationMethod',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 670 char 1',
                                     'Opaque<"string">',
                                     methodId_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('removeVerificationMethod',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 670 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('removeVerificationMethod',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 670 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(methodId_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._removeVerificationMethod_0(context,
                                                                partialProofData,
                                                                methodId_0,
                                                                controllerSignature_0,
                                                                expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      setSchnorrJubjubVerificationMethod: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`setSchnorrJubjubVerificationMethod: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const verificationMethod_0 = args_1[1];
        const mutation_0 = args_1[2];
        const controllerSignature_0 = args_1[3];
        const expectedVersion_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setSchnorrJubjubVerificationMethod',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 688 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(verificationMethod_0) === 'object' && typeof (verificationMethod_0.id) === 'string' && typeof(verificationMethod_0.publicKey.x) === 'bigint' && typeof(verificationMethod_0.publicKey.y) === 'bigint')) {
          __compactRuntime.typeError('setSchnorrJubjubVerificationMethod',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 688 char 1',
                                     'struct SchnorrJubjubVerificationMethod<id: Opaque<"string">, publicKey: JubjubPoint>',
                                     verificationMethod_0)
        }
        if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
          __compactRuntime.typeError('setSchnorrJubjubVerificationMethod',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 688 char 1',
                                     'Enum<MapMutation, Undefined, Insert, Update>',
                                     mutation_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('setSchnorrJubjubVerificationMethod',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 688 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('setSchnorrJubjubVerificationMethod',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'did.compact line 688 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_12.toValue(verificationMethod_0).concat(_descriptor_11.toValue(mutation_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0)))),
            alignment: _descriptor_12.alignment().concat(_descriptor_11.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._setSchnorrJubjubVerificationMethod_0(context,
                                                                          partialProofData,
                                                                          verificationMethod_0,
                                                                          mutation_0,
                                                                          controllerSignature_0,
                                                                          expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      removeSchnorrJubjubVerificationMethod: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`removeSchnorrJubjubVerificationMethod: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const methodId_0 = args_1[1];
        const controllerSignature_0 = args_1[2];
        const expectedVersion_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('removeSchnorrJubjubVerificationMethod',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 718 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof (methodId_0) === 'string')) {
          __compactRuntime.typeError('removeSchnorrJubjubVerificationMethod',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 718 char 1',
                                     'Opaque<"string">',
                                     methodId_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('removeSchnorrJubjubVerificationMethod',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 718 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('removeSchnorrJubjubVerificationMethod',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 718 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(methodId_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._removeSchnorrJubjubVerificationMethod_0(context,
                                                                             partialProofData,
                                                                             methodId_0,
                                                                             controllerSignature_0,
                                                                             expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      verifySchnorrJubjubDigestSignature: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`verifySchnorrJubjubDigestSignature: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const methodId_0 = args_1[1];
        const digest_0 = args_1[2];
        const signature_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('verifySchnorrJubjubDigestSignature',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 742 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof (methodId_0) === 'string')) {
          __compactRuntime.typeError('verifySchnorrJubjubDigestSignature',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 742 char 1',
                                     'Opaque<"string">',
                                     methodId_0)
        }
        if (!(Array.isArray(digest_0) && digest_0.length === 4 && digest_0.every((t) => typeof(t) === 'bigint' && t >= 0 && t <= __compactRuntime.MAX_FIELD))) {
          __compactRuntime.typeError('verifySchnorrJubjubDigestSignature',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 742 char 1',
                                     'Vector<4, Field>',
                                     digest_0)
        }
        if (!(typeof(signature_0) === 'object' && typeof(signature_0.announcement.x) === 'bigint' && typeof(signature_0.announcement.y) === 'bigint' && typeof(signature_0.response) === 'bigint' && signature_0.response >= 0 && signature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('verifySchnorrJubjubDigestSignature',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 742 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     signature_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(methodId_0).concat(_descriptor_13.toValue(digest_0).concat(_descriptor_7.toValue(signature_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_13.alignment().concat(_descriptor_7.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._verifySchnorrJubjubDigestSignature_0(context,
                                                                          partialProofData,
                                                                          methodId_0,
                                                                          digest_0,
                                                                          signature_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      setVerificationMethodRelation: async (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`setVerificationMethodRelation: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const relation_0 = args_1[1];
        const methodId_0 = args_1[2];
        const mutation_0 = args_1[3];
        const controllerSignature_0 = args_1[4];
        const expectedVersion_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setVerificationMethodRelation',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 754 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(relation_0) === 'number' && relation_0 >= 0 && relation_0 <= 5)) {
          __compactRuntime.typeError('setVerificationMethodRelation',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 754 char 1',
                                     'Enum<VerificationMethodRelation, Undefined, Authentication, AssertionMethod, KeyAgreement, CapabilityInvocation, CapabilityDelegation>',
                                     relation_0)
        }
        if (!(typeof (methodId_0) === 'string')) {
          __compactRuntime.typeError('setVerificationMethodRelation',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 754 char 1',
                                     'Opaque<"string">',
                                     methodId_0)
        }
        if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
          __compactRuntime.typeError('setVerificationMethodRelation',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 754 char 1',
                                     'Enum<SetMutation, Undefined, Insert, Remove>',
                                     mutation_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('setVerificationMethodRelation',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'did.compact line 754 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('setVerificationMethodRelation',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'did.compact line 754 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_9.toValue(relation_0).concat(_descriptor_0.toValue(methodId_0).concat(_descriptor_10.toValue(mutation_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0))))),
            alignment: _descriptor_9.alignment().concat(_descriptor_0.alignment().concat(_descriptor_10.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._setVerificationMethodRelation_0(context,
                                                                     partialProofData,
                                                                     relation_0,
                                                                     methodId_0,
                                                                     mutation_0,
                                                                     controllerSignature_0,
                                                                     expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      setService: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`setService: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const service_0 = args_1[1];
        const mutation_0 = args_1[2];
        const controllerSignature_0 = args_1[3];
        const expectedVersion_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setService',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 791 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(service_0) === 'object' && typeof (service_0.id) === 'string' && typeof (service_0.typ) === 'string' && typeof (service_0.serviceEndpoint) === 'string')) {
          __compactRuntime.typeError('setService',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 791 char 1',
                                     'struct Service<id: Opaque<"string">, typ: Opaque<"string">, serviceEndpoint: Opaque<"string">>',
                                     service_0)
        }
        if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
          __compactRuntime.typeError('setService',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 791 char 1',
                                     'Enum<MapMutation, Undefined, Insert, Update>',
                                     mutation_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('setService',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 791 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('setService',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'did.compact line 791 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(service_0).concat(_descriptor_11.toValue(mutation_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0)))),
            alignment: _descriptor_1.alignment().concat(_descriptor_11.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._setService_0(context,
                                                  partialProofData,
                                                  service_0,
                                                  mutation_0,
                                                  controllerSignature_0,
                                                  expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      removeService: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`removeService: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const serviceId_0 = args_1[1];
        const controllerSignature_0 = args_1[2];
        const expectedVersion_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('removeService',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 816 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof (serviceId_0) === 'string')) {
          __compactRuntime.typeError('removeService',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 816 char 1',
                                     'Opaque<"string">',
                                     serviceId_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('removeService',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 816 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('removeService',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'did.compact line 816 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(serviceId_0).concat(_descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._removeService_0(context,
                                                     partialProofData,
                                                     serviceId_0,
                                                     controllerSignature_0,
                                                     expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      deactivate: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`deactivate: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const controllerSignature_0 = args_1[1];
        const expectedVersion_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('deactivate',
                                     'argument 1 (as invoked from Typescript)',
                                     'did.compact line 833 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(controllerSignature_0) === 'object' && typeof(controllerSignature_0.announcement.x) === 'bigint' && typeof(controllerSignature_0.announcement.y) === 'bigint' && typeof(controllerSignature_0.response) === 'bigint' && controllerSignature_0.response >= 0 && controllerSignature_0.response <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('deactivate',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'did.compact line 833 char 1',
                                     'struct SchnorrSignature<announcement: JubjubPoint, response: Field>',
                                     controllerSignature_0)
        }
        if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('deactivate',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'did.compact line 833 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_7.toValue(controllerSignature_0).concat(_descriptor_8.toValue(expectedVersion_0)),
            alignment: _descriptor_7.alignment().concat(_descriptor_8.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._deactivate_0(context,
                                                  partialProofData,
                                                  controllerSignature_0,
                                                  expectedVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      }
    };
    this.impureCircuits = {
      rotateControllerKey: this.circuits.rotateControllerKey,
      recoverControllerKey: this.circuits.recoverControllerKey,
      setAlsoKnownAs: this.circuits.setAlsoKnownAs,
      setVerificationMethod: this.circuits.setVerificationMethod,
      removeVerificationMethod: this.circuits.removeVerificationMethod,
      setSchnorrJubjubVerificationMethod: this.circuits.setSchnorrJubjubVerificationMethod,
      removeSchnorrJubjubVerificationMethod: this.circuits.removeSchnorrJubjubVerificationMethod,
      verifySchnorrJubjubDigestSignature: this.circuits.verifySchnorrJubjubDigestSignature,
      setVerificationMethodRelation: this.circuits.setVerificationMethodRelation,
      setService: this.circuits.setService,
      removeService: this.circuits.removeService,
      deactivate: this.circuits.deactivate
    };
    this.provableCircuits = {
      rotateControllerKey: this.circuits.rotateControllerKey,
      recoverControllerKey: this.circuits.recoverControllerKey,
      setAlsoKnownAs: this.circuits.setAlsoKnownAs,
      setVerificationMethod: this.circuits.setVerificationMethod,
      removeVerificationMethod: this.circuits.removeVerificationMethod,
      setSchnorrJubjubVerificationMethod: this.circuits.setSchnorrJubjubVerificationMethod,
      removeSchnorrJubjubVerificationMethod: this.circuits.removeSchnorrJubjubVerificationMethod,
      verifySchnorrJubjubDigestSignature: this.circuits.verifySchnorrJubjubDigestSignature,
      setVerificationMethodRelation: this.circuits.setVerificationMethodRelation,
      setService: this.circuits.setService,
      removeService: this.circuits.removeService,
      deactivate: this.circuits.deactivate
    };
  }
  async initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
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
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    let stateValue_2 = __compactRuntime.StateValue.newArray();
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(stateValue_2);
    let stateValue_1 = __compactRuntime.StateValue.newArray();
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(stateValue_1);
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('rotateControllerKey', new __compactRuntime.ContractOperation());
    state_0.setOperation('recoverControllerKey', new __compactRuntime.ContractOperation());
    state_0.setOperation('setAlsoKnownAs', new __compactRuntime.ContractOperation());
    state_0.setOperation('setVerificationMethod', new __compactRuntime.ContractOperation());
    state_0.setOperation('removeVerificationMethod', new __compactRuntime.ContractOperation());
    state_0.setOperation('setSchnorrJubjubVerificationMethod', new __compactRuntime.ContractOperation());
    state_0.setOperation('removeSchnorrJubjubVerificationMethod', new __compactRuntime.ContractOperation());
    state_0.setOperation('verifySchnorrJubjubDigestSignature', new __compactRuntime.ContractOperation());
    state_0.setOperation('setVerificationMethodRelation', new __compactRuntime.ContractOperation());
    state_0.setOperation('setService', new __compactRuntime.ContractOperation());
    state_0.setOperation('removeService', new __compactRuntime.ContractOperation());
    state_0.setOperation('deactivate', new __compactRuntime.ContractOperation());
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
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(0n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_41.toValue(0n),
                                                                                              alignment: _descriptor_41.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(({x: 0n, y: 1n})),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(2n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(({x: 0n, y: 1n})),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(3n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue({ bytes: new Uint8Array(32) }),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(0n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(2n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(3n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(4n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(false),
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(5n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(false),
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(6n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(7n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(8n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(9n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(10n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(11n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(12n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(13n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(14n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 2n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(0n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_41.toValue(tmp_0),
                                                                                              alignment: _descriptor_41.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 2 } },
                                                                             { idx: { cached: true,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_42.toValue(0n),
                                                                                                        alignment: _descriptor_42.alignment() } }] } },
                                                                             { popeq: { cached: true,
                                                                                        result: undefined } }]).value);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(3n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_1),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(5n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(true),
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(4n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(false),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = this._localControllerPublicKey_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_2),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_3 = this._localRecoveryAuthorityPublicKey_0(context,
                                                          partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(2n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_3),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await this._assertControllerPublicKeyDistinctFromRecoveryAuthority_0(context,
                                                                         partialProofData,
                                                                         _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                   partialProofData,
                                                                                                                                   [
                                                                                                                                    { dup: { n: 0 } },
                                                                                                                                    { idx: { cached: false,
                                                                                                                                             pushPath: false,
                                                                                                                                             path: [
                                                                                                                                                    { tag: 'value',
                                                                                                                                                      value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                               alignment: _descriptor_42.alignment() } },
                                                                                                                                                    { tag: 'value',
                                                                                                                                                      value: { value: _descriptor_42.toValue(1n),
                                                                                                                                                               alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                    { popeq: { cached: false,
                                                                                                                                               result: undefined } }]).value));
    const timestamp_0 = this._currentTimestamp_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(2n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(timestamp_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(3n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(timestamp_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.callContext.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.callContext.currentPrivateState,
      currentZswapLocalState: context.callContext.currentZswapLocalState
    }
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_38, value_0);
    return result_0;
  }
  _transientHash_1(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_36, value_0);
    return result_0;
  }
  _transientHash_2(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_37, value_0);
    return result_0;
  }
  _transientHash_3(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_34, value_0);
    return result_0;
  }
  _transientHash_4(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_35, value_0);
    return result_0;
  }
  _transientHash_5(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_32, value_0);
    return result_0;
  }
  _transientHash_6(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_33, value_0);
    return result_0;
  }
  _transientHash_7(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_30, value_0);
    return result_0;
  }
  _transientHash_8(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_31, value_0);
    return result_0;
  }
  _transientHash_9(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_28, value_0);
    return result_0;
  }
  _transientHash_10(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_29, value_0);
    return result_0;
  }
  _transientHash_11(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_26, value_0);
    return result_0;
  }
  _transientHash_12(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_27, value_0);
    return result_0;
  }
  _transientHash_13(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_24, value_0);
    return result_0;
  }
  _transientHash_14(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_25, value_0);
    return result_0;
  }
  _jubjubPointX_0(pt_0) {
    const result_0 = __compactRuntime.jubjubPointX(pt_0);
    return result_0;
  }
  _jubjubPointY_0(pt_0) {
    const result_0 = __compactRuntime.jubjubPointY(pt_0);
    return result_0;
  }
  _ecAdd_0(a_0, b_0) {
    const result_0 = __compactRuntime.ecAdd(a_0, b_0);
    return result_0;
  }
  _ecMul_0(a_0, b_0) {
    const result_0 = __compactRuntime.ecMul(a_0, b_0);
    return result_0;
  }
  _ecMulGenerator_0(b_0) {
    const result_0 = __compactRuntime.ecMulGenerator(b_0);
    return result_0;
  }
  _getSchnorrReduction_0(context, partialProofData, challengeHash_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getSchnorrReduction(witnessContext_0,
                                                                              challengeHash_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 2  && typeof(result_0[0]) === 'bigint' && result_0[0] >= 0n && result_0[0] <= 127n && typeof(result_0[1]) === 'bigint' && result_0[1] >= 0n && result_0[1] <= 452312848583266388373324160190187140051835877600158453279131187530910662655n)) {
      __compactRuntime.typeError('getSchnorrReduction',
                                 'return value',
                                 'schnorr.compact line 32 char 3',
                                 '[Uint<0..128>, Uint<0..452312848583266388373324160190187140051835877600158453279131187530910662656>]',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_23.toValue(result_0),
      alignment: _descriptor_23.alignment()
    });
    return result_0;
  }
  async _schnorrVerify_0(context, partialProofData, msg_0, signature_0, pk_0) {
    const __compact_pattern_tmp2_0 = signature_0;
    const announcement_0 = __compact_pattern_tmp2_0.announcement;
    const response_0 = __compact_pattern_tmp2_0.response;
    const cFull_0 = this._transientHash_14({ ann_x:
                                               this._jubjubPointX_0(announcement_0),
                                             ann_y:
                                               this._jubjubPointY_0(announcement_0),
                                             pk_x: this._jubjubPointX_0(pk_0),
                                             pk_y: this._jubjubPointY_0(pk_0),
                                             msg: msg_0 });
    const TWO_248_0 = 452312848583266388373324160190187140051835877600158453279131187530910662656n;
    const __compact_pattern_tmp1_0 = this._getSchnorrReduction_0(context,
                                                                 partialProofData,
                                                                 cFull_0);
    const q_0 = __compact_pattern_tmp1_0[0];
    const cTruncated_0 = __compact_pattern_tmp1_0[1];
    let t_0;
    __compactRuntime.assert((t_0 = q_0, t_0 < 116n),
                            'Schnorr quotient out of range');
    __compactRuntime.assert(__compactRuntime.addField(__compactRuntime.mulField(q_0,
                                                                                TWO_248_0),
                                                      cTruncated_0)
                            ===
                            cFull_0,
                            'Invalid challenge reduction');
    const c_0 = cTruncated_0;
    const lhs_0 = this._ecMulGenerator_0(response_0);
    const rhs_0 = this._ecAdd_0(announcement_0, this._ecMul_0(pk_0, c_0));
    __compactRuntime.assert(this._jubjubPointX_0(lhs_0)
                            ===
                            this._jubjubPointX_0(rhs_0)
                            &&
                            this._jubjubPointY_0(lhs_0)
                            ===
                            this._jubjubPointY_0(rhs_0),
                            'Invalid Jubjub Schnorr signature');
    return [];
  }
  async _schnorrVerifyDigest_0(context,
                               partialProofData,
                               digest_0,
                               signature_0,
                               pk_0)
  {
    await this._schnorrVerify_0(context,
                                partialProofData,
                                digest_0,
                                signature_0,
                                pk_0);
    return [];
  }
  _localControllerPublicKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localControllerPublicKey(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0.x) === 'bigint' && typeof(result_0.y) === 'bigint')) {
      __compactRuntime.typeError('localControllerPublicKey',
                                 'return value',
                                 'did.compact line 45 char 1',
                                 'JubjubPoint',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_5.toValue(result_0),
      alignment: _descriptor_5.alignment()
    });
    return result_0;
  }
  _localRecoveryAuthorityPublicKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localRecoveryAuthorityPublicKey(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0.x) === 'bigint' && typeof(result_0.y) === 'bigint')) {
      __compactRuntime.typeError('localRecoveryAuthorityPublicKey',
                                 'return value',
                                 'did.compact line 46 char 1',
                                 'JubjubPoint',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_5.toValue(result_0),
      alignment: _descriptor_5.alignment()
    });
    return result_0;
  }
  _currentTimestamp_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.currentTimestamp(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('currentTimestamp',
                                 'return value',
                                 'did.compact line 47 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_8.toValue(result_0),
      alignment: _descriptor_8.alignment()
    });
    return result_0;
  }
  async _verificationMethodExists_0(context, partialProofData, id_0) {
    return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_42.toValue(1n),
                                                                                                 alignment: _descriptor_42.alignment() } },
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_42.toValue(7n),
                                                                                                 alignment: _descriptor_42.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value)
           ||
           _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_42.toValue(1n),
                                                                                                 alignment: _descriptor_42.alignment() } },
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_42.toValue(8n),
                                                                                                 alignment: _descriptor_42.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _controllerOperationHash_0(name_0) {
    return this._transientHash_12({ name: name_0 });
  }
  _controllerNoArgsHash_0() {
    return this._transientHash_13({ domain:
                                      new Uint8Array([110, 111, 45, 97, 114, 103, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) });
  }
  _controllerAuthorizationDigest_0(contractId_0,
                                   expectedVersion_0,
                                   operationHash_0,
                                   argsHash_0)
  {
    return [this._transientHash_0({ domain:
                                      new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 45, 100, 105, 100, 45, 99, 116, 114, 108, 45, 115, 105, 103, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]) }),
            this._transientHash_1({ contractId: contractId_0,
                                    version: expectedVersion_0 }),
            operationHash_0,
            argsHash_0];
  }
  _rotateControllerKeyAuthorizationDigest_0(contractId_0,
                                            expectedVersion_0,
                                            newControllerPublicKey_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([114, 111, 116, 97, 116, 101, 67, 111, 110, 116, 114, 111, 108, 108, 101, 114, 75, 101, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_2({ publicKeyX:
                                                                           this._jubjubPointX_0(newControllerPublicKey_0),
                                                                         publicKeyY:
                                                                           this._jubjubPointY_0(newControllerPublicKey_0) }));
  }
  _recoverControllerKeyAuthorizationDigest_0(contractId_0,
                                             expectedVersion_0,
                                             newControllerPublicKey_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([114, 101, 99, 111, 118, 101, 114, 67, 111, 110, 116, 114, 111, 108, 108, 101, 114, 75, 101, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_3({ publicKeyX:
                                                                           this._jubjubPointX_0(newControllerPublicKey_0),
                                                                         publicKeyY:
                                                                           this._jubjubPointY_0(newControllerPublicKey_0) }));
  }
  _setAlsoKnownAsAuthorizationDigest_0(contractId_0,
                                       expectedVersion_0,
                                       value_0,
                                       mutation_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([115, 101, 116, 65, 108, 115, 111, 75, 110, 111, 119, 110, 65, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_4({ value:
                                                                           value_0,
                                                                         mutation:
                                                                           mutation_0 }));
  }
  _setVerificationMethodAuthorizationDigest_0(contractId_0,
                                              expectedVersion_0,
                                              verificationMethod_0,
                                              mutation_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([115, 101, 116, 86, 101, 114, 105, 102, 105, 99, 97, 116, 105, 111, 110, 77, 101, 116, 104, 111, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_5({ verificationMethod:
                                                                           verificationMethod_0,
                                                                         mutation:
                                                                           mutation_0 }));
  }
  _removeVerificationMethodAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 id_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([114, 101, 109, 111, 118, 101, 86, 101, 114, 105, 102, 105, 99, 97, 116, 105, 111, 110, 77, 101, 116, 104, 111, 100, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_6({ id:
                                                                           id_0 }));
  }
  _setSchnorrJubjubVerificationMethodAuthorizationDigest_0(contractId_0,
                                                           expectedVersion_0,
                                                           verificationMethod_0,
                                                           mutation_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([115, 101, 116, 83, 99, 104, 110, 111, 114, 114, 74, 117, 98, 106, 117, 98, 86, 77, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_7({ id:
                                                                           verificationMethod_0.id,
                                                                         publicKeyX:
                                                                           this._jubjubPointX_0(verificationMethod_0.publicKey),
                                                                         publicKeyY:
                                                                           this._jubjubPointY_0(verificationMethod_0.publicKey),
                                                                         mutation:
                                                                           mutation_0 }));
  }
  _removeSchnorrJubjubVerificationMethodAuthorizationDigest_0(contractId_0,
                                                              expectedVersion_0,
                                                              id_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([114, 101, 109, 111, 118, 101, 83, 99, 104, 110, 111, 114, 114, 74, 117, 98, 106, 117, 98, 86, 77, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_8({ id:
                                                                           id_0 }));
  }
  _setVerificationMethodRelationAuthorizationDigest_0(contractId_0,
                                                      expectedVersion_0,
                                                      relation_0,
                                                      methodId_0,
                                                      mutation_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([115, 101, 116, 86, 77, 82, 101, 108, 97, 116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_9({ relation:
                                                                           relation_0,
                                                                         methodId:
                                                                           methodId_0,
                                                                         mutation:
                                                                           mutation_0 }));
  }
  _setServiceAuthorizationDigest_0(contractId_0,
                                   expectedVersion_0,
                                   service_0,
                                   mutation_0)
  {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([115, 101, 116, 83, 101, 114, 118, 105, 99, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_10({ service:
                                                                            service_0,
                                                                          mutation:
                                                                            mutation_0 }));
  }
  _removeServiceAuthorizationDigest_0(contractId_0, expectedVersion_0, id_0) {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([114, 101, 109, 111, 118, 101, 83, 101, 114, 118, 105, 99, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._transientHash_11({ id:
                                                                            id_0 }));
  }
  _deactivateAuthorizationDigest_0(contractId_0, expectedVersion_0) {
    return this._controllerAuthorizationDigest_0(contractId_0,
                                                 expectedVersion_0,
                                                 this._controllerOperationHash_0(new Uint8Array([100, 101, 97, 99, 116, 105, 118, 97, 116, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                 this._controllerNoArgsHash_0());
  }
  async _assertController_0(context,
                            partialProofData,
                            signature_0,
                            expectedVersion_0,
                            digest_0)
  {
    __compactRuntime.assert(expectedVersion_0
                            ===
                            _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Controller authorization version is stale');
    await this._schnorrVerifyDigest_0(context,
                                      partialProofData,
                                      digest_0,
                                      signature_0,
                                      _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 0 } },
                                                                                                 { idx: { cached: false,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_42.toValue(0n),
                                                                                                                            alignment: _descriptor_42.alignment() } },
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_42.toValue(1n),
                                                                                                                            alignment: _descriptor_42.alignment() } }] } },
                                                                                                 { popeq: { cached: false,
                                                                                                            result: undefined } }]).value));
    return [];
  }
  async _assertControllerCanUpdate_0(context,
                                     partialProofData,
                                     signature_0,
                                     expectedVersion_0,
                                     digest_0)
  {
    await this._assertController_0(context,
                                   partialProofData,
                                   signature_0,
                                   expectedVersion_0,
                                   digest_0);
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(5n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'Contract is not active');
    return [];
  }
  async _assertRecoveryCanUpdate_0(context,
                                   partialProofData,
                                   signature_0,
                                   expectedVersion_0,
                                   digest_0)
  {
    __compactRuntime.assert(expectedVersion_0
                            ===
                            _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Recovery authorization version is stale');
    await this._schnorrVerifyDigest_0(context,
                                      partialProofData,
                                      digest_0,
                                      signature_0,
                                      _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 0 } },
                                                                                                 { idx: { cached: false,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_42.toValue(0n),
                                                                                                                            alignment: _descriptor_42.alignment() } },
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_42.toValue(2n),
                                                                                                                            alignment: _descriptor_42.alignment() } }] } },
                                                                                                 { popeq: { cached: false,
                                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(5n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'Contract is not active');
    return [];
  }
  async _assertControllerPublicKeyChanges_0(context,
                                            partialProofData,
                                            newControllerPublicKey_0)
  {
    __compactRuntime.assert(this._jubjubPointX_0(newControllerPublicKey_0)
                            !==
                            this._jubjubPointX_0(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_42.toValue(0n),
                                                                                                                                       alignment: _descriptor_42.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_42.toValue(1n),
                                                                                                                                       alignment: _descriptor_42.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value))
                            ||
                            this._jubjubPointY_0(newControllerPublicKey_0)
                            !==
                            this._jubjubPointY_0(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_42.toValue(0n),
                                                                                                                                       alignment: _descriptor_42.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_42.toValue(1n),
                                                                                                                                       alignment: _descriptor_42.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value)),
                            'New controller key matches current controller key');
    return [];
  }
  async _assertControllerPublicKeyDistinctFromRecoveryAuthority_0(context,
                                                                  partialProofData,
                                                                  newControllerPublicKey_0)
  {
    __compactRuntime.assert(this._jubjubPointX_0(newControllerPublicKey_0)
                            !==
                            this._jubjubPointX_0(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_42.toValue(0n),
                                                                                                                                       alignment: _descriptor_42.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_42.toValue(2n),
                                                                                                                                       alignment: _descriptor_42.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value))
                            ||
                            this._jubjubPointY_0(newControllerPublicKey_0)
                            !==
                            this._jubjubPointY_0(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_42.toValue(0n),
                                                                                                                                       alignment: _descriptor_42.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_42.toValue(2n),
                                                                                                                                       alignment: _descriptor_42.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value)),
                            'New controller key matches recovery authority key');
    return [];
  }
  async _recordUpdate_0(context, partialProofData) {
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(6n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_19.toValue(tmp_0),
                                                                alignment: _descriptor_19.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 2 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_19.toValue(tmp_1),
                                                                alignment: _descriptor_19.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 2 } }]);
    const tmp_2 = this._currentTimestamp_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(3n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_2),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _assertMapMutationDefined_0(mutation_0) {
    __compactRuntime.assert(mutation_0 === 1 || mutation_0 === 2,
                            'Map mutation must be Insert or Update');
    return [];
  }
  _assertSetMutationDefined_0(mutation_0) {
    __compactRuntime.assert(mutation_0 === 1 || mutation_0 === 2,
                            'Set mutation must be Insert or Remove');
    return [];
  }
  _assertSupportedVerificationMethod_0(verificationMethod_0) {
    __compactRuntime.assert(verificationMethod_0.typ === 1,
                            'Only JsonWebKey verification methods are supported');
    if (verificationMethod_0.publicKeyJwk.kty === 3) {
      __compactRuntime.assert(verificationMethod_0.publicKeyJwk.crv === 0
                              ||
                              verificationMethod_0.publicKeyJwk.crv === 1
                              ||
                              verificationMethod_0.publicKeyJwk.crv === 5
                              ||
                              verificationMethod_0.publicKeyJwk.crv === 6,
                              'OKP keys must use Ed25519, X25519, BLS12381G1, or BLS12381G2');
    } else {
      if (verificationMethod_0.publicKeyJwk.kty === 0) {
        __compactRuntime.assert(verificationMethod_0.publicKeyJwk.crv === 3
                                ||
                                verificationMethod_0.publicKeyJwk.crv === 4,
                                'EC keys must use P-256 or secp256k1; use SchnorrJubjub methods for Jubjub');
      } else {
        __compactRuntime.assert(false,
                                'Only OKP (Ed25519/X25519/BLS12381G1/BLS12381G2) and EC (P-256/secp256k1) keys are supported');
      }
    }
    return [];
  }
  async _verificationMethodRelationMember_0(context,
                                            partialProofData,
                                            relation_0,
                                            methodId_0)
  {
    if (relation_0 === 1) {
      return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(9n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { push: { storage: false,
                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                        'member',
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    } else {
      if (relation_0 === 2) {
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(10n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      } else {
        if (relation_0 === 3) {
          return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                           partialProofData,
                                                                           [
                                                                            { dup: { n: 0 } },
                                                                            { idx: { cached: false,
                                                                                     pushPath: false,
                                                                                     path: [
                                                                                            { tag: 'value',
                                                                                              value: { value: _descriptor_42.toValue(1n),
                                                                                                       alignment: _descriptor_42.alignment() } },
                                                                                            { tag: 'value',
                                                                                              value: { value: _descriptor_42.toValue(11n),
                                                                                                       alignment: _descriptor_42.alignment() } }] } },
                                                                            { push: { storage: false,
                                                                                      value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                                   alignment: _descriptor_0.alignment() }).encode() } },
                                                                            'member',
                                                                            { popeq: { cached: true,
                                                                                       result: undefined } }]).value);
        } else {
          if (relation_0 === 4) {
            return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_42.toValue(1n),
                                                                                                         alignment: _descriptor_42.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_42.toValue(12n),
                                                                                                         alignment: _descriptor_42.alignment() } }] } },
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                                     alignment: _descriptor_0.alignment() }).encode() } },
                                                                              'member',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          } else {
            if (relation_0 === 5) {
              return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_42.toValue(1n),
                                                                                                           alignment: _descriptor_42.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_42.toValue(13n),
                                                                                                           alignment: _descriptor_42.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                                       alignment: _descriptor_0.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value);
            } else {
              return false;
            }
          }
        }
      }
    }
  }
  async _insertVerificationMethodRelation_0(context,
                                            partialProofData,
                                            relation_0,
                                            methodId_0)
  {
    if (relation_0 === 1) {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(1n),
                                                                    alignment: _descriptor_42.alignment() } },
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(9n),
                                                                    alignment: _descriptor_42.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newNull().encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 2 } }]);
    } else {
      if (relation_0 === 2) {
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_42.toValue(1n),
                                                                      alignment: _descriptor_42.alignment() } },
                                                           { tag: 'value',
                                                             value: { value: _descriptor_42.toValue(10n),
                                                                      alignment: _descriptor_42.alignment() } }] } },
                                           { push: { storage: false,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                           { push: { storage: true,
                                                     value: __compactRuntime.StateValue.newNull().encode() } },
                                           { ins: { cached: false, n: 1 } },
                                           { ins: { cached: true, n: 2 } }]);
      } else {
        if (relation_0 === 3) {
          __compactRuntime.queryLedgerState(context,
                                            partialProofData,
                                            [
                                             { idx: { cached: false,
                                                      pushPath: true,
                                                      path: [
                                                             { tag: 'value',
                                                               value: { value: _descriptor_42.toValue(1n),
                                                                        alignment: _descriptor_42.alignment() } },
                                                             { tag: 'value',
                                                               value: { value: _descriptor_42.toValue(11n),
                                                                        alignment: _descriptor_42.alignment() } }] } },
                                             { push: { storage: false,
                                                       value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                    alignment: _descriptor_0.alignment() }).encode() } },
                                             { push: { storage: true,
                                                       value: __compactRuntime.StateValue.newNull().encode() } },
                                             { ins: { cached: false, n: 1 } },
                                             { ins: { cached: true, n: 2 } }]);
        } else {
          if (relation_0 === 4) {
            __compactRuntime.queryLedgerState(context,
                                              partialProofData,
                                              [
                                               { idx: { cached: false,
                                                        pushPath: true,
                                                        path: [
                                                               { tag: 'value',
                                                                 value: { value: _descriptor_42.toValue(1n),
                                                                          alignment: _descriptor_42.alignment() } },
                                                               { tag: 'value',
                                                                 value: { value: _descriptor_42.toValue(12n),
                                                                          alignment: _descriptor_42.alignment() } }] } },
                                               { push: { storage: false,
                                                         value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                      alignment: _descriptor_0.alignment() }).encode() } },
                                               { push: { storage: true,
                                                         value: __compactRuntime.StateValue.newNull().encode() } },
                                               { ins: { cached: false, n: 1 } },
                                               { ins: { cached: true, n: 2 } }]);
          } else {
            if (relation_0 === 5) {
              __compactRuntime.queryLedgerState(context,
                                                partialProofData,
                                                [
                                                 { idx: { cached: false,
                                                          pushPath: true,
                                                          path: [
                                                                 { tag: 'value',
                                                                   value: { value: _descriptor_42.toValue(1n),
                                                                            alignment: _descriptor_42.alignment() } },
                                                                 { tag: 'value',
                                                                   value: { value: _descriptor_42.toValue(13n),
                                                                            alignment: _descriptor_42.alignment() } }] } },
                                                 { push: { storage: false,
                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                        alignment: _descriptor_0.alignment() }).encode() } },
                                                 { push: { storage: true,
                                                           value: __compactRuntime.StateValue.newNull().encode() } },
                                                 { ins: { cached: false, n: 1 } },
                                                 { ins: { cached: true, n: 2 } }]);
            }
          }
        }
      }
    }
    return [];
  }
  async _removeVerificationMethodRelationFromLedger_0(context,
                                                      partialProofData,
                                                      relation_0,
                                                      methodId_0)
  {
    if (relation_0 === 1) {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(1n),
                                                                    alignment: _descriptor_42.alignment() } },
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(9n),
                                                                    alignment: _descriptor_42.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 2 } }]);
    } else {
      if (relation_0 === 2) {
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_42.toValue(1n),
                                                                      alignment: _descriptor_42.alignment() } },
                                                           { tag: 'value',
                                                             value: { value: _descriptor_42.toValue(10n),
                                                                      alignment: _descriptor_42.alignment() } }] } },
                                           { push: { storage: false,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                           { rem: { cached: false } },
                                           { ins: { cached: true, n: 2 } }]);
      } else {
        if (relation_0 === 3) {
          __compactRuntime.queryLedgerState(context,
                                            partialProofData,
                                            [
                                             { idx: { cached: false,
                                                      pushPath: true,
                                                      path: [
                                                             { tag: 'value',
                                                               value: { value: _descriptor_42.toValue(1n),
                                                                        alignment: _descriptor_42.alignment() } },
                                                             { tag: 'value',
                                                               value: { value: _descriptor_42.toValue(11n),
                                                                        alignment: _descriptor_42.alignment() } }] } },
                                             { push: { storage: false,
                                                       value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                    alignment: _descriptor_0.alignment() }).encode() } },
                                             { rem: { cached: false } },
                                             { ins: { cached: true, n: 2 } }]);
        } else {
          if (relation_0 === 4) {
            __compactRuntime.queryLedgerState(context,
                                              partialProofData,
                                              [
                                               { idx: { cached: false,
                                                        pushPath: true,
                                                        path: [
                                                               { tag: 'value',
                                                                 value: { value: _descriptor_42.toValue(1n),
                                                                          alignment: _descriptor_42.alignment() } },
                                                               { tag: 'value',
                                                                 value: { value: _descriptor_42.toValue(12n),
                                                                          alignment: _descriptor_42.alignment() } }] } },
                                               { push: { storage: false,
                                                         value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                      alignment: _descriptor_0.alignment() }).encode() } },
                                               { rem: { cached: false } },
                                               { ins: { cached: true, n: 2 } }]);
          } else {
            if (relation_0 === 5) {
              __compactRuntime.queryLedgerState(context,
                                                partialProofData,
                                                [
                                                 { idx: { cached: false,
                                                          pushPath: true,
                                                          path: [
                                                                 { tag: 'value',
                                                                   value: { value: _descriptor_42.toValue(1n),
                                                                            alignment: _descriptor_42.alignment() } },
                                                                 { tag: 'value',
                                                                   value: { value: _descriptor_42.toValue(13n),
                                                                            alignment: _descriptor_42.alignment() } }] } },
                                                 { push: { storage: false,
                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                        alignment: _descriptor_0.alignment() }).encode() } },
                                                 { rem: { cached: false } },
                                                 { ins: { cached: true, n: 2 } }]);
            }
          }
        }
      }
    }
    return [];
  }
  async _assertVerificationMethodIsNotReferenced_0(context,
                                                   partialProofData,
                                                   id_0)
  {
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(9n),
                                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Verification method still referenced in authenticationRelation');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(10n),
                                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Verification method still referenced in assertionMethodRelation');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(11n),
                                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Verification method still referenced in keyAgreementRelation');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(12n),
                                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Verification method still referenced in capabilityInvocationRelation');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_42.toValue(13n),
                                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Verification method still referenced in capabilityDelegationRelation');
    return [];
  }
  _isSigningVerificationMethodRelation_0(relation_0) {
    return relation_0 === 1 || relation_0 === 2 || relation_0 === 4
           ||
           relation_0 === 5;
  }
  async _assertVerificationMethodRelationCompatible_0(context,
                                                      partialProofData,
                                                      relation_0,
                                                      methodId_0)
  {
    if (relation_0 === 3) {
      __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_42.toValue(1n),
                                                                                                                    alignment: _descriptor_42.alignment() } },
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_42.toValue(7n),
                                                                                                                    alignment: _descriptor_42.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                              'KeyAgreement requires an agreement verification method');
      const verificationMethod_0 = _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_42.toValue(1n),
                                                                                                                          alignment: _descriptor_42.alignment() } },
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_42.toValue(7n),
                                                                                                                          alignment: _descriptor_42.alignment() } }] } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_0.toValue(methodId_0),
                                                                                                                          alignment: _descriptor_0.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value);
      __compactRuntime.assert(verificationMethod_0.publicKeyJwk.crv === 1,
                              'KeyAgreement requires an X25519 verification method');
    } else {
      if (this._isSigningVerificationMethodRelation_0(relation_0)) {
        __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                           partialProofData,
                                                                                           [
                                                                                            { dup: { n: 0 } },
                                                                                            { idx: { cached: false,
                                                                                                     pushPath: false,
                                                                                                     path: [
                                                                                                            { tag: 'value',
                                                                                                              value: { value: _descriptor_42.toValue(1n),
                                                                                                                       alignment: _descriptor_42.alignment() } },
                                                                                                            { tag: 'value',
                                                                                                              value: { value: _descriptor_42.toValue(7n),
                                                                                                                       alignment: _descriptor_42.alignment() } }] } },
                                                                                            { push: { storage: false,
                                                                                                      value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                                                   alignment: _descriptor_0.alignment() }).encode() } },
                                                                                            'member',
                                                                                            { popeq: { cached: true,
                                                                                                       result: undefined } }]).value)
                                ||
                                _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                           partialProofData,
                                                                                           [
                                                                                            { dup: { n: 0 } },
                                                                                            { idx: { cached: false,
                                                                                                     pushPath: false,
                                                                                                     path: [
                                                                                                            { tag: 'value',
                                                                                                              value: { value: _descriptor_42.toValue(1n),
                                                                                                                       alignment: _descriptor_42.alignment() } },
                                                                                                            { tag: 'value',
                                                                                                              value: { value: _descriptor_42.toValue(7n),
                                                                                                                       alignment: _descriptor_42.alignment() } }] } },
                                                                                            { idx: { cached: false,
                                                                                                     pushPath: false,
                                                                                                     path: [
                                                                                                            { tag: 'value',
                                                                                                              value: { value: _descriptor_0.toValue(methodId_0),
                                                                                                                       alignment: _descriptor_0.alignment() } }] } },
                                                                                            { popeq: { cached: false,
                                                                                                       result: undefined } }]).value).publicKeyJwk.crv
                                !==
                                1,
                                'Signing verification relations cannot use X25519 verification methods');
      }
    }
    return [];
  }
  async _assertExistingVerificationMethodRelationsCompatible_0(context,
                                                               partialProofData,
                                                               methodId_0,
                                                               curve_0)
  {
    if (_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() } },
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(11n),
                                                                                              alignment: _descriptor_42.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value))
    {
      __compactRuntime.assert(curve_0 === 1,
                              'Existing KeyAgreement relation requires an X25519 verification method');
    }
    if (_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() } },
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(9n),
                                                                                              alignment: _descriptor_42.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value)
        ||
        _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() } },
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(10n),
                                                                                              alignment: _descriptor_42.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value)
        ||
        _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() } },
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(12n),
                                                                                              alignment: _descriptor_42.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value)
        ||
        _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() } },
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_42.toValue(13n),
                                                                                              alignment: _descriptor_42.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(methodId_0),
                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value))
    {
      __compactRuntime.assert(curve_0 !== 1,
                              'Existing signing verification relations cannot use X25519 verification methods');
    }
    return [];
  }
  async _rotateControllerKey_0(context,
                               partialProofData,
                               newControllerPublicKey_0,
                               controllerSignature_0,
                               expectedVersion_0)
  {
    const disclosedNewControllerPublicKey_0 = newControllerPublicKey_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._rotateControllerKeyAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                     partialProofData,
                                                                                                                                                     [
                                                                                                                                                      { dup: { n: 0 } },
                                                                                                                                                      { idx: { cached: false,
                                                                                                                                                               pushPath: false,
                                                                                                                                                               path: [
                                                                                                                                                                      { tag: 'value',
                                                                                                                                                                        value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                                 alignment: _descriptor_42.alignment() } },
                                                                                                                                                                      { tag: 'value',
                                                                                                                                                                        value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                                 alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                      { popeq: { cached: false,
                                                                                                                                                                 result: undefined } }]).value),
                                                                                           expectedVersion_0,
                                                                                           disclosedNewControllerPublicKey_0));
    await this._assertControllerPublicKeyChanges_0(context,
                                                   partialProofData,
                                                   disclosedNewControllerPublicKey_0);
    await this._assertControllerPublicKeyDistinctFromRecoveryAuthority_0(context,
                                                                         partialProofData,
                                                                         disclosedNewControllerPublicKey_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedNewControllerPublicKey_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _recoverControllerKey_0(context,
                                partialProofData,
                                newControllerPublicKey_0,
                                recoverySignature_0,
                                expectedVersion_0)
  {
    const disclosedNewControllerPublicKey_0 = newControllerPublicKey_0;
    await this._assertRecoveryCanUpdate_0(context,
                                          partialProofData,
                                          recoverySignature_0,
                                          expectedVersion_0,
                                          this._recoverControllerKeyAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                    partialProofData,
                                                                                                                                                    [
                                                                                                                                                     { dup: { n: 0 } },
                                                                                                                                                     { idx: { cached: false,
                                                                                                                                                              pushPath: false,
                                                                                                                                                              path: [
                                                                                                                                                                     { tag: 'value',
                                                                                                                                                                       value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                                alignment: _descriptor_42.alignment() } },
                                                                                                                                                                     { tag: 'value',
                                                                                                                                                                       value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                                alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                     { popeq: { cached: false,
                                                                                                                                                                result: undefined } }]).value),
                                                                                          expectedVersion_0,
                                                                                          disclosedNewControllerPublicKey_0));
    await this._assertControllerPublicKeyChanges_0(context,
                                                   partialProofData,
                                                   disclosedNewControllerPublicKey_0);
    await this._assertControllerPublicKeyDistinctFromRecoveryAuthority_0(context,
                                                                         partialProofData,
                                                                         disclosedNewControllerPublicKey_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(0n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(1n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedNewControllerPublicKey_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _setAlsoKnownAs_0(context,
                          partialProofData,
                          value_0,
                          mutation_0,
                          controllerSignature_0,
                          expectedVersion_0)
  {
    const disclosedMutation_0 = mutation_0;
    const alias_0 = value_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._setAlsoKnownAsAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                partialProofData,
                                                                                                                                                [
                                                                                                                                                 { dup: { n: 0 } },
                                                                                                                                                 { idx: { cached: false,
                                                                                                                                                          pushPath: false,
                                                                                                                                                          path: [
                                                                                                                                                                 { tag: 'value',
                                                                                                                                                                   value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                            alignment: _descriptor_42.alignment() } },
                                                                                                                                                                 { tag: 'value',
                                                                                                                                                                   value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                            alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                 { popeq: { cached: false,
                                                                                                                                                            result: undefined } }]).value),
                                                                                      expectedVersion_0,
                                                                                      alias_0,
                                                                                      disclosedMutation_0));
    this._assertSetMutationDefined_0(disclosedMutation_0);
    if (disclosedMutation_0 === 1) {
      __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_42.toValue(0n),
                                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                                          { push: { storage: false,
                                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(alias_0),
                                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                                          'member',
                                                                                          { popeq: { cached: true,
                                                                                                     result: undefined } }]).value),
                              'alsoKnownAs value already exists');
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(1n),
                                                                    alignment: _descriptor_42.alignment() } },
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(0n),
                                                                    alignment: _descriptor_42.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(alias_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newNull().encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 2 } }]);
    } else {
      if (disclosedMutation_0 === 2) {
        __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_42.toValue(1n),
                                                                                                                      alignment: _descriptor_42.alignment() } },
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_42.toValue(0n),
                                                                                                                      alignment: _descriptor_42.alignment() } }] } },
                                                                                           { push: { storage: false,
                                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(alias_0),
                                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                                           'member',
                                                                                           { popeq: { cached: true,
                                                                                                      result: undefined } }]).value),
                                'alsoKnownAs value does not exist');
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_42.toValue(1n),
                                                                      alignment: _descriptor_42.alignment() } },
                                                           { tag: 'value',
                                                             value: { value: _descriptor_42.toValue(0n),
                                                                      alignment: _descriptor_42.alignment() } }] } },
                                           { push: { storage: false,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(alias_0),
                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                           { rem: { cached: false } },
                                           { ins: { cached: true, n: 2 } }]);
      }
    }
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _setVerificationMethod_0(context,
                                 partialProofData,
                                 verificationMethod_0,
                                 mutation_0,
                                 controllerSignature_0,
                                 expectedVersion_0)
  {
    const disclosedVerificationMethod_0 = verificationMethod_0;
    const disclosedMutation_0 = mutation_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._setVerificationMethodAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                       partialProofData,
                                                                                                                                                       [
                                                                                                                                                        { dup: { n: 0 } },
                                                                                                                                                        { idx: { cached: false,
                                                                                                                                                                 pushPath: false,
                                                                                                                                                                 path: [
                                                                                                                                                                        { tag: 'value',
                                                                                                                                                                          value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                                                                                                        { tag: 'value',
                                                                                                                                                                          value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                        { popeq: { cached: false,
                                                                                                                                                                   result: undefined } }]).value),
                                                                                             expectedVersion_0,
                                                                                             disclosedVerificationMethod_0,
                                                                                             disclosedMutation_0));
    this._assertMapMutationDefined_0(disclosedMutation_0);
    this._assertSupportedVerificationMethod_0(disclosedVerificationMethod_0);
    if (disclosedMutation_0 === 2) {
      let tmp_0;
      __compactRuntime.assert((tmp_0 = disclosedVerificationMethod_0.id,
                               _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_42.toValue(7n),
                                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                                          { push: { storage: false,
                                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                                          'member',
                                                                                          { popeq: { cached: true,
                                                                                                     result: undefined } }]).value)),
                              'Verification method does not exist');
      await this._assertExistingVerificationMethodRelationsCompatible_0(context,
                                                                        partialProofData,
                                                                        disclosedVerificationMethod_0.id,
                                                                        disclosedVerificationMethod_0.publicKeyJwk.crv);
      const tmp_1 = disclosedVerificationMethod_0.id;
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(1n),
                                                                    alignment: _descriptor_42.alignment() } },
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(7n),
                                                                    alignment: _descriptor_42.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 2 } }]);
    } else {
      if (disclosedMutation_0 === 1) {
        __compactRuntime.assert(!await this._verificationMethodExists_0(context,
                                                                        partialProofData,
                                                                        disclosedVerificationMethod_0.id),
                                'Verification method already exists');
      }
    }
    const tmp_2 = disclosedVerificationMethod_0.id;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(7n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(disclosedVerificationMethod_0),
                                                                                              alignment: _descriptor_18.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _removeVerificationMethod_0(context,
                                    partialProofData,
                                    methodId_0,
                                    controllerSignature_0,
                                    expectedVersion_0)
  {
    const disclosedId_0 = methodId_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._removeVerificationMethodAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                          partialProofData,
                                                                                                                                                          [
                                                                                                                                                           { dup: { n: 0 } },
                                                                                                                                                           { idx: { cached: false,
                                                                                                                                                                    pushPath: false,
                                                                                                                                                                    path: [
                                                                                                                                                                           { tag: 'value',
                                                                                                                                                                             value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                                      alignment: _descriptor_42.alignment() } },
                                                                                                                                                                           { tag: 'value',
                                                                                                                                                                             value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                                      alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                           { popeq: { cached: false,
                                                                                                                                                                      result: undefined } }]).value),
                                                                                                expectedVersion_0,
                                                                                                disclosedId_0));
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(7n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Verification method does not exist');
    await this._assertVerificationMethodIsNotReferenced_0(context,
                                                          partialProofData,
                                                          disclosedId_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(7n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _setSchnorrJubjubVerificationMethod_0(context,
                                              partialProofData,
                                              verificationMethod_0,
                                              mutation_0,
                                              controllerSignature_0,
                                              expectedVersion_0)
  {
    const disclosedVerificationMethod_0 = verificationMethod_0;
    const disclosedMutation_0 = mutation_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._setSchnorrJubjubVerificationMethodAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                                    partialProofData,
                                                                                                                                                                    [
                                                                                                                                                                     { dup: { n: 0 } },
                                                                                                                                                                     { idx: { cached: false,
                                                                                                                                                                              pushPath: false,
                                                                                                                                                                              path: [
                                                                                                                                                                                     { tag: 'value',
                                                                                                                                                                                       value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                                                alignment: _descriptor_42.alignment() } },
                                                                                                                                                                                     { tag: 'value',
                                                                                                                                                                                       value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                                                alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                                     { popeq: { cached: false,
                                                                                                                                                                                result: undefined } }]).value),
                                                                                                          expectedVersion_0,
                                                                                                          disclosedVerificationMethod_0,
                                                                                                          disclosedMutation_0));
    this._assertMapMutationDefined_0(disclosedMutation_0);
    if (disclosedMutation_0 === 2) {
      let tmp_0;
      __compactRuntime.assert((tmp_0 = disclosedVerificationMethod_0.id,
                               _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_42.toValue(8n),
                                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                                          { push: { storage: false,
                                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                                          'member',
                                                                                          { popeq: { cached: true,
                                                                                                     result: undefined } }]).value)),
                              'Verification method does not exist');
      const tmp_1 = disclosedVerificationMethod_0.id;
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(1n),
                                                                    alignment: _descriptor_42.alignment() } },
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(8n),
                                                                    alignment: _descriptor_42.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 2 } }]);
    } else {
      if (disclosedMutation_0 === 1) {
        __compactRuntime.assert(!await this._verificationMethodExists_0(context,
                                                                        partialProofData,
                                                                        disclosedVerificationMethod_0.id),
                                'Verification method already exists');
      }
    }
    const tmp_2 = disclosedVerificationMethod_0.id;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(8n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(disclosedVerificationMethod_0),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _removeSchnorrJubjubVerificationMethod_0(context,
                                                 partialProofData,
                                                 methodId_0,
                                                 controllerSignature_0,
                                                 expectedVersion_0)
  {
    const disclosedId_0 = methodId_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._removeSchnorrJubjubVerificationMethodAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                                       partialProofData,
                                                                                                                                                                       [
                                                                                                                                                                        { dup: { n: 0 } },
                                                                                                                                                                        { idx: { cached: false,
                                                                                                                                                                                 pushPath: false,
                                                                                                                                                                                 path: [
                                                                                                                                                                                        { tag: 'value',
                                                                                                                                                                                          value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                                                                                                                        { tag: 'value',
                                                                                                                                                                                          value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                                        { popeq: { cached: false,
                                                                                                                                                                                   result: undefined } }]).value),
                                                                                                             expectedVersion_0,
                                                                                                             disclosedId_0));
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(8n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Verification method does not exist');
    await this._assertVerificationMethodIsNotReferenced_0(context,
                                                          partialProofData,
                                                          disclosedId_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(8n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _verifySchnorrJubjubDigestSignature_0(context,
                                              partialProofData,
                                              methodId_0,
                                              digest_0,
                                              signature_0)
  {
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(5n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'Contract is not active');
    const disclosedMethodId_0 = methodId_0;
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(8n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedMethodId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Verification method does not exist');
    const verificationMethod_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_42.toValue(1n),
                                                                                                                        alignment: _descriptor_42.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_42.toValue(8n),
                                                                                                                        alignment: _descriptor_42.alignment() } }] } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_0.toValue(disclosedMethodId_0),
                                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value);
    await this._schnorrVerifyDigest_0(context,
                                      partialProofData,
                                      digest_0,
                                      signature_0,
                                      verificationMethod_0.publicKey);
    return [];
  }
  async _setVerificationMethodRelation_0(context,
                                         partialProofData,
                                         relation_0,
                                         methodId_0,
                                         mutation_0,
                                         controllerSignature_0,
                                         expectedVersion_0)
  {
    const disclosedRelation_0 = relation_0;
    const disclosedMethodId_0 = methodId_0;
    const disclosedMutation_0 = mutation_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._setVerificationMethodRelationAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                               partialProofData,
                                                                                                                                                               [
                                                                                                                                                                { dup: { n: 0 } },
                                                                                                                                                                { idx: { cached: false,
                                                                                                                                                                         pushPath: false,
                                                                                                                                                                         path: [
                                                                                                                                                                                { tag: 'value',
                                                                                                                                                                                  value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                                           alignment: _descriptor_42.alignment() } },
                                                                                                                                                                                { tag: 'value',
                                                                                                                                                                                  value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                                           alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                                { popeq: { cached: false,
                                                                                                                                                                           result: undefined } }]).value),
                                                                                                     expectedVersion_0,
                                                                                                     disclosedRelation_0,
                                                                                                     disclosedMethodId_0,
                                                                                                     disclosedMutation_0));
    this._assertSetMutationDefined_0(disclosedMutation_0);
    __compactRuntime.assert(await this._verificationMethodExists_0(context,
                                                                   partialProofData,
                                                                   disclosedMethodId_0),
                            'Verification method does not exist');
    __compactRuntime.assert(disclosedRelation_0 !== 0,
                            'Verification relation must be defined');
    const currentPresent_0 = await this._verificationMethodRelationMember_0(context,
                                                                            partialProofData,
                                                                            disclosedRelation_0,
                                                                            disclosedMethodId_0);
    if (disclosedMutation_0 === 1) {
      __compactRuntime.assert(!currentPresent_0,
                              'Verification method relation already exists');
      await this._assertVerificationMethodRelationCompatible_0(context,
                                                               partialProofData,
                                                               disclosedRelation_0,
                                                               disclosedMethodId_0);
      await this._insertVerificationMethodRelation_0(context,
                                                     partialProofData,
                                                     disclosedRelation_0,
                                                     disclosedMethodId_0);
    } else {
      if (disclosedMutation_0 === 2) {
        __compactRuntime.assert(currentPresent_0,
                                'Verification method relation does not exist');
        await this._removeVerificationMethodRelationFromLedger_0(context,
                                                                 partialProofData,
                                                                 disclosedRelation_0,
                                                                 disclosedMethodId_0);
      }
    }
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _setService_0(context,
                      partialProofData,
                      service_0,
                      mutation_0,
                      controllerSignature_0,
                      expectedVersion_0)
  {
    const disclosedService_0 = service_0;
    const disclosedMutation_0 = mutation_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._setServiceAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                            partialProofData,
                                                                                                                                            [
                                                                                                                                             { dup: { n: 0 } },
                                                                                                                                             { idx: { cached: false,
                                                                                                                                                      pushPath: false,
                                                                                                                                                      path: [
                                                                                                                                                             { tag: 'value',
                                                                                                                                                               value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                        alignment: _descriptor_42.alignment() } },
                                                                                                                                                             { tag: 'value',
                                                                                                                                                               value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                        alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                             { popeq: { cached: false,
                                                                                                                                                        result: undefined } }]).value),
                                                                                  expectedVersion_0,
                                                                                  disclosedService_0,
                                                                                  disclosedMutation_0));
    this._assertMapMutationDefined_0(disclosedMutation_0);
    if (disclosedMutation_0 === 2) {
      let tmp_0;
      __compactRuntime.assert((tmp_0 = disclosedService_0.id,
                               _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_42.toValue(14n),
                                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                                          { push: { storage: false,
                                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                                          'member',
                                                                                          { popeq: { cached: true,
                                                                                                     result: undefined } }]).value)),
                              'Service with a given id does not exist');
      const tmp_1 = disclosedService_0.id;
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(1n),
                                                                    alignment: _descriptor_42.alignment() } },
                                                         { tag: 'value',
                                                           value: { value: _descriptor_42.toValue(14n),
                                                                    alignment: _descriptor_42.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 2 } }]);
    } else {
      if (disclosedMutation_0 === 1) {
        let tmp_2;
        __compactRuntime.assert(!(tmp_2 = disclosedService_0.id,
                                  _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_42.toValue(1n),
                                                                                                                        alignment: _descriptor_42.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_42.toValue(14n),
                                                                                                                        alignment: _descriptor_42.alignment() } }] } },
                                                                                             { push: { storage: false,
                                                                                                       value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                                                                                    alignment: _descriptor_0.alignment() }).encode() } },
                                                                                             'member',
                                                                                             { popeq: { cached: true,
                                                                                                        result: undefined } }]).value)),
                                'Service with a given id already exists');
      }
    }
    const tmp_3 = disclosedService_0.id;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(14n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_3),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(disclosedService_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _removeService_0(context,
                         partialProofData,
                         serviceId_0,
                         controllerSignature_0,
                         expectedVersion_0)
  {
    const disclosedId_0 = serviceId_0;
    await this._assertControllerCanUpdate_0(context,
                                            partialProofData,
                                            controllerSignature_0,
                                            expectedVersion_0,
                                            this._removeServiceAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                               partialProofData,
                                                                                                                                               [
                                                                                                                                                { dup: { n: 0 } },
                                                                                                                                                { idx: { cached: false,
                                                                                                                                                         pushPath: false,
                                                                                                                                                         path: [
                                                                                                                                                                { tag: 'value',
                                                                                                                                                                  value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                                           alignment: _descriptor_42.alignment() } },
                                                                                                                                                                { tag: 'value',
                                                                                                                                                                  value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                                           alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                                { popeq: { cached: false,
                                                                                                                                                           result: undefined } }]).value),
                                                                                     expectedVersion_0,
                                                                                     disclosedId_0));
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(14n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Service with a given id does not exist');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(14n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
  }
  async _deactivate_0(context,
                      partialProofData,
                      controllerSignature_0,
                      expectedVersion_0)
  {
    await this._assertController_0(context,
                                   partialProofData,
                                   controllerSignature_0,
                                   expectedVersion_0,
                                   this._deactivateAuthorizationDigest_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                   partialProofData,
                                                                                                                                   [
                                                                                                                                    { dup: { n: 0 } },
                                                                                                                                    { idx: { cached: false,
                                                                                                                                             pushPath: false,
                                                                                                                                             path: [
                                                                                                                                                    { tag: 'value',
                                                                                                                                                      value: { value: _descriptor_42.toValue(0n),
                                                                                                                                                               alignment: _descriptor_42.alignment() } },
                                                                                                                                                    { tag: 'value',
                                                                                                                                                      value: { value: _descriptor_42.toValue(3n),
                                                                                                                                                               alignment: _descriptor_42.alignment() } }] } },
                                                                                                                                    { popeq: { cached: false,
                                                                                                                                               result: undefined } }]).value),
                                                                         expectedVersion_0));
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(1n),
                                                                                                                  alignment: _descriptor_42.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_42.toValue(5n),
                                                                                                                  alignment: _descriptor_42.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'DID is already inactive');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(5n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(false),
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
                                                         value: { value: _descriptor_42.toValue(1n),
                                                                  alignment: _descriptor_42.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_42.toValue(4n),
                                                                                              alignment: _descriptor_42.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(true),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await this._recordUpdate_0(context, partialProofData);
    return [];
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
    get contractVersion() {
      return _descriptor_41.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_42.toValue(0n),
                                                                                                    alignment: _descriptor_42.alignment() } },
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_42.toValue(0n),
                                                                                                    alignment: _descriptor_42.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    },
    get controllerPublicKey() {
      return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(0n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get recoveryAuthorityPublicKey() {
      return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(0n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(2n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get id() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(0n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(3n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    alsoKnownAs: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(0n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(0n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(typeof (elem_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 28 char 1',
                                     'Opaque<"string">',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(0n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[0];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    get version() {
      return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get created() {
      return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(2n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get updated() {
      return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(3n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get deactivated() {
      return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(4n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get active() {
      return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(5n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get operationCount() {
      return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(1n),
                                                                                                   alignment: _descriptor_42.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_42.toValue(6n),
                                                                                                   alignment: _descriptor_42.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    verificationMethods: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(7n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(7n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof (key_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 35 char 1',
                                     'Opaque<"string">',
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
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(7n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof (key_0) === 'string')) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'did.compact line 35 char 1',
                                     'Opaque<"string">',
                                     key_0)
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_42.toValue(1n),
                                                                                                      alignment: _descriptor_42.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_42.toValue(7n),
                                                                                                      alignment: _descriptor_42.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(key_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[7];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_18.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    schnorrJubjubVerificationMethods: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(8n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(8n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof (key_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 36 char 1',
                                     'Opaque<"string">',
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
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(8n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof (key_0) === 'string')) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'did.compact line 36 char 1',
                                     'Opaque<"string">',
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
                                                                                             value: { value: _descriptor_42.toValue(1n),
                                                                                                      alignment: _descriptor_42.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_42.toValue(8n),
                                                                                                      alignment: _descriptor_42.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(key_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[8];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_12.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    authenticationRelation: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(9n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(9n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(typeof (elem_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 37 char 1',
                                     'Opaque<"string">',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(9n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[9];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    assertionMethodRelation: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(10n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(10n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(typeof (elem_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 38 char 1',
                                     'Opaque<"string">',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(10n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[10];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    keyAgreementRelation: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(11n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(11n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(typeof (elem_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 39 char 1',
                                     'Opaque<"string">',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(11n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[11];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    capabilityInvocationRelation: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(12n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(12n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(typeof (elem_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 40 char 1',
                                     'Opaque<"string">',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(12n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[12];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    capabilityDelegationRelation: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(13n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(13n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(typeof (elem_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 41 char 1',
                                     'Opaque<"string">',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(13n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[13];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    services: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(14n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(14n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof (key_0) === 'string')) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'did.compact line 42 char 1',
                                     'Opaque<"string">',
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
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(14n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof (key_0) === 'string')) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'did.compact line 42 char 1',
                                     'Opaque<"string">',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(1n),
                                                                                                     alignment: _descriptor_42.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_42.toValue(14n),
                                                                                                     alignment: _descriptor_42.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[14];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  callContext: { currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() }
};
const _dummyContract = new Contract({
  getSchnorrReduction: (...args) => undefined,
  localControllerPublicKey: (...args) => undefined,
  localRecoveryAuthorityPublicKey: (...args) => undefined,
  currentTimestamp: (...args) => undefined
});
export const pureCircuits = {
  controllerAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`controllerAuthorizationDigest: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const operationHash_0 = args_0[2];
    const argsHash_0 = args_0[3];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('controllerAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 191 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('controllerAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 191 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof(operationHash_0) === 'bigint' && operationHash_0 >= 0 && operationHash_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('controllerAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 191 char 1',
                                 'Field',
                                 operationHash_0)
    }
    if (!(typeof(argsHash_0) === 'bigint' && argsHash_0 >= 0 && argsHash_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('controllerAuthorizationDigest',
                                 'argument 4',
                                 'did.compact line 191 char 1',
                                 'Field',
                                 argsHash_0)
    }
    return _dummyContract._controllerAuthorizationDigest_0(contractId_0,
                                                           expectedVersion_0,
                                                           operationHash_0,
                                                           argsHash_0);
  },
  rotateControllerKeyAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`rotateControllerKeyAuthorizationDigest: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const newControllerPublicKey_0 = args_0[2];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('rotateControllerKeyAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 212 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('rotateControllerKeyAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 212 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof(newControllerPublicKey_0.x) === 'bigint' && typeof(newControllerPublicKey_0.y) === 'bigint')) {
      __compactRuntime.typeError('rotateControllerKeyAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 212 char 1',
                                 'JubjubPoint',
                                 newControllerPublicKey_0)
    }
    return _dummyContract._rotateControllerKeyAuthorizationDigest_0(contractId_0,
                                                                    expectedVersion_0,
                                                                    newControllerPublicKey_0);
  },
  recoverControllerKeyAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`recoverControllerKeyAuthorizationDigest: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const newControllerPublicKey_0 = args_0[2];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('recoverControllerKeyAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 230 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('recoverControllerKeyAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 230 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof(newControllerPublicKey_0.x) === 'bigint' && typeof(newControllerPublicKey_0.y) === 'bigint')) {
      __compactRuntime.typeError('recoverControllerKeyAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 230 char 1',
                                 'JubjubPoint',
                                 newControllerPublicKey_0)
    }
    return _dummyContract._recoverControllerKeyAuthorizationDigest_0(contractId_0,
                                                                     expectedVersion_0,
                                                                     newControllerPublicKey_0);
  },
  setAlsoKnownAsAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`setAlsoKnownAsAuthorizationDigest: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const value_0 = args_0[2];
    const mutation_0 = args_0[3];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('setAlsoKnownAsAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 248 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('setAlsoKnownAsAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 248 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof (value_0) === 'string')) {
      __compactRuntime.typeError('setAlsoKnownAsAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 248 char 1',
                                 'Opaque<"string">',
                                 value_0)
    }
    if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
      __compactRuntime.typeError('setAlsoKnownAsAuthorizationDigest',
                                 'argument 4',
                                 'did.compact line 248 char 1',
                                 'Enum<SetMutation, Undefined, Insert, Remove>',
                                 mutation_0)
    }
    return _dummyContract._setAlsoKnownAsAuthorizationDigest_0(contractId_0,
                                                               expectedVersion_0,
                                                               value_0,
                                                               mutation_0);
  },
  setVerificationMethodAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`setVerificationMethodAuthorizationDigest: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const verificationMethod_0 = args_0[2];
    const mutation_0 = args_0[3];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('setVerificationMethodAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 264 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('setVerificationMethodAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 264 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof(verificationMethod_0) === 'object' && typeof (verificationMethod_0.id) === 'string' && typeof(verificationMethod_0.typ) === 'number' && verificationMethod_0.typ >= 0 && verificationMethod_0.typ <= 1 && typeof(verificationMethod_0.publicKeyJwk) === 'object' && typeof(verificationMethod_0.publicKeyJwk.kty) === 'number' && verificationMethod_0.publicKeyJwk.kty >= 0 && verificationMethod_0.publicKeyJwk.kty <= 3 && typeof(verificationMethod_0.publicKeyJwk.crv) === 'number' && verificationMethod_0.publicKeyJwk.crv >= 0 && verificationMethod_0.publicKeyJwk.crv <= 6 && typeof (verificationMethod_0.publicKeyJwk.x) === 'string' && typeof (verificationMethod_0.publicKeyJwk.y) === 'string')) {
      __compactRuntime.typeError('setVerificationMethodAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 264 char 1',
                                 'struct VerificationMethod<id: Opaque<"string">, typ: Enum<VerificationMethodType, Undefined, JsonWebKey>, publicKeyJwk: struct PublicKeyJwk<kty: Enum<KeyType, EC, RSA, oct, OKP>, crv: Enum<CurveType, Ed25519, X25519, Jubjub, P256, Secp256k1, BLS12381G1, BLS12381G2>, x: Opaque<"string">, y: Opaque<"string">>>',
                                 verificationMethod_0)
    }
    if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
      __compactRuntime.typeError('setVerificationMethodAuthorizationDigest',
                                 'argument 4',
                                 'did.compact line 264 char 1',
                                 'Enum<MapMutation, Undefined, Insert, Update>',
                                 mutation_0)
    }
    return _dummyContract._setVerificationMethodAuthorizationDigest_0(contractId_0,
                                                                      expectedVersion_0,
                                                                      verificationMethod_0,
                                                                      mutation_0);
  },
  removeVerificationMethodAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`removeVerificationMethodAuthorizationDigest: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const id_0 = args_0[2];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('removeVerificationMethodAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 283 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('removeVerificationMethodAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 283 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof (id_0) === 'string')) {
      __compactRuntime.typeError('removeVerificationMethodAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 283 char 1',
                                 'Opaque<"string">',
                                 id_0)
    }
    return _dummyContract._removeVerificationMethodAuthorizationDigest_0(contractId_0,
                                                                         expectedVersion_0,
                                                                         id_0);
  },
  setSchnorrJubjubVerificationMethodAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`setSchnorrJubjubVerificationMethodAuthorizationDigest: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const verificationMethod_0 = args_0[2];
    const mutation_0 = args_0[3];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('setSchnorrJubjubVerificationMethodAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 298 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('setSchnorrJubjubVerificationMethodAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 298 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof(verificationMethod_0) === 'object' && typeof (verificationMethod_0.id) === 'string' && typeof(verificationMethod_0.publicKey.x) === 'bigint' && typeof(verificationMethod_0.publicKey.y) === 'bigint')) {
      __compactRuntime.typeError('setSchnorrJubjubVerificationMethodAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 298 char 1',
                                 'struct SchnorrJubjubVerificationMethod<id: Opaque<"string">, publicKey: JubjubPoint>',
                                 verificationMethod_0)
    }
    if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
      __compactRuntime.typeError('setSchnorrJubjubVerificationMethodAuthorizationDigest',
                                 'argument 4',
                                 'did.compact line 298 char 1',
                                 'Enum<MapMutation, Undefined, Insert, Update>',
                                 mutation_0)
    }
    return _dummyContract._setSchnorrJubjubVerificationMethodAuthorizationDigest_0(contractId_0,
                                                                                   expectedVersion_0,
                                                                                   verificationMethod_0,
                                                                                   mutation_0);
  },
  removeSchnorrJubjubVerificationMethodAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`removeSchnorrJubjubVerificationMethodAuthorizationDigest: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const id_0 = args_0[2];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('removeSchnorrJubjubVerificationMethodAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 319 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('removeSchnorrJubjubVerificationMethodAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 319 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof (id_0) === 'string')) {
      __compactRuntime.typeError('removeSchnorrJubjubVerificationMethodAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 319 char 1',
                                 'Opaque<"string">',
                                 id_0)
    }
    return _dummyContract._removeSchnorrJubjubVerificationMethodAuthorizationDigest_0(contractId_0,
                                                                                      expectedVersion_0,
                                                                                      id_0);
  },
  setVerificationMethodRelationAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`setVerificationMethodRelationAuthorizationDigest: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const relation_0 = args_0[2];
    const methodId_0 = args_0[3];
    const mutation_0 = args_0[4];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('setVerificationMethodRelationAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 334 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('setVerificationMethodRelationAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 334 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof(relation_0) === 'number' && relation_0 >= 0 && relation_0 <= 5)) {
      __compactRuntime.typeError('setVerificationMethodRelationAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 334 char 1',
                                 'Enum<VerificationMethodRelation, Undefined, Authentication, AssertionMethod, KeyAgreement, CapabilityInvocation, CapabilityDelegation>',
                                 relation_0)
    }
    if (!(typeof (methodId_0) === 'string')) {
      __compactRuntime.typeError('setVerificationMethodRelationAuthorizationDigest',
                                 'argument 4',
                                 'did.compact line 334 char 1',
                                 'Opaque<"string">',
                                 methodId_0)
    }
    if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
      __compactRuntime.typeError('setVerificationMethodRelationAuthorizationDigest',
                                 'argument 5',
                                 'did.compact line 334 char 1',
                                 'Enum<SetMutation, Undefined, Insert, Remove>',
                                 mutation_0)
    }
    return _dummyContract._setVerificationMethodRelationAuthorizationDigest_0(contractId_0,
                                                                              expectedVersion_0,
                                                                              relation_0,
                                                                              methodId_0,
                                                                              mutation_0);
  },
  setServiceAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`setServiceAuthorizationDigest: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const service_0 = args_0[2];
    const mutation_0 = args_0[3];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('setServiceAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 355 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('setServiceAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 355 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof(service_0) === 'object' && typeof (service_0.id) === 'string' && typeof (service_0.typ) === 'string' && typeof (service_0.serviceEndpoint) === 'string')) {
      __compactRuntime.typeError('setServiceAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 355 char 1',
                                 'struct Service<id: Opaque<"string">, typ: Opaque<"string">, serviceEndpoint: Opaque<"string">>',
                                 service_0)
    }
    if (!(typeof(mutation_0) === 'number' && mutation_0 >= 0 && mutation_0 <= 2)) {
      __compactRuntime.typeError('setServiceAuthorizationDigest',
                                 'argument 4',
                                 'did.compact line 355 char 1',
                                 'Enum<MapMutation, Undefined, Insert, Update>',
                                 mutation_0)
    }
    return _dummyContract._setServiceAuthorizationDigest_0(contractId_0,
                                                           expectedVersion_0,
                                                           service_0,
                                                           mutation_0);
  },
  removeServiceAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`removeServiceAuthorizationDigest: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    const id_0 = args_0[2];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('removeServiceAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 371 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('removeServiceAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 371 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    if (!(typeof (id_0) === 'string')) {
      __compactRuntime.typeError('removeServiceAuthorizationDigest',
                                 'argument 3',
                                 'did.compact line 371 char 1',
                                 'Opaque<"string">',
                                 id_0)
    }
    return _dummyContract._removeServiceAuthorizationDigest_0(contractId_0,
                                                              expectedVersion_0,
                                                              id_0);
  },
  deactivateAuthorizationDigest: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`deactivateAuthorizationDigest: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const contractId_0 = args_0[0];
    const expectedVersion_0 = args_0[1];
    if (!(typeof(contractId_0) === 'object' && contractId_0.bytes.buffer instanceof ArrayBuffer && contractId_0.bytes.BYTES_PER_ELEMENT === 1 && contractId_0.bytes.length === 32)) {
      __compactRuntime.typeError('deactivateAuthorizationDigest',
                                 'argument 1',
                                 'did.compact line 384 char 1',
                                 'struct ContractAddress<bytes: Bytes<32>>',
                                 contractId_0)
    }
    if (!(typeof(expectedVersion_0) === 'bigint' && expectedVersion_0 >= 0n && expectedVersion_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('deactivateAuthorizationDigest',
                                 'argument 2',
                                 'did.compact line 384 char 1',
                                 'Uint<0..18446744073709551616>',
                                 expectedVersion_0)
    }
    return _dummyContract._deactivateAuthorizationDigest_0(contractId_0,
                                                           expectedVersion_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
export const expectedVk = {};


import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum VerificationMethodType { Undefined = 0, JsonWebKey = 1 }

export enum VerificationMethodRelation { Undefined = 0,
                                         Authentication = 1,
                                         AssertionMethod = 2,
                                         KeyAgreement = 3,
                                         CapabilityInvocation = 4,
                                         CapabilityDelegation = 5
}

export enum MapMutation { Undefined = 0, Insert = 1, Update = 2 }

export enum SetMutation { Undefined = 0, Insert = 1, Remove = 2 }

export enum KeyType { EC = 0, RSA = 1, oct = 2, OKP = 3 }

export enum CurveType { Ed25519 = 0,
                        X25519 = 1,
                        Jubjub = 2,
                        P256 = 3,
                        Secp256k1 = 4,
                        BLS12381G1 = 5,
                        BLS12381G2 = 6
}

export type PublicKeyJwk = { kty: KeyType; crv: CurveType; x: string; y: string
                           };

export type VerificationMethod = { id: string;
                                   typ: VerificationMethodType;
                                   publicKeyJwk: PublicKeyJwk
                                 };

export type SchnorrJubjubVerificationMethod = { id: string;
                                                publicKey: __compactRuntime.JubjubPoint
                                              };

export type Service = { id: string; typ: string; serviceEndpoint: string };

export type Schnorr_SchnorrSignature = { announcement: __compactRuntime.JubjubPoint;
                                         response: bigint
                                       };

export type Witnesses<PS> = {
  getSchnorrReduction(context: __compactRuntime.WitnessContext<Ledger, PS>,
                      challengeHash_0: bigint): [PS, [bigint, bigint]];
  localControllerPublicKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, __compactRuntime.JubjubPoint];
  localRecoveryAuthorityPublicKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, __compactRuntime.JubjubPoint];
  currentTimestamp(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  rotateControllerKey(context: __compactRuntime.CircuitContext<PS>,
                      newControllerPublicKey_0: __compactRuntime.JubjubPoint,
                      controllerSignature_0: Schnorr_SchnorrSignature,
                      expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  recoverControllerKey(context: __compactRuntime.CircuitContext<PS>,
                       newControllerPublicKey_0: __compactRuntime.JubjubPoint,
                       recoverySignature_0: Schnorr_SchnorrSignature,
                       expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setAlsoKnownAs(context: __compactRuntime.CircuitContext<PS>,
                 value_0: string,
                 mutation_0: SetMutation,
                 controllerSignature_0: Schnorr_SchnorrSignature,
                 expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                        verificationMethod_0: VerificationMethod,
                        mutation_0: MapMutation,
                        controllerSignature_0: Schnorr_SchnorrSignature,
                        expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                           methodId_0: string,
                           controllerSignature_0: Schnorr_SchnorrSignature,
                           expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setSchnorrJubjubVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                                     verificationMethod_0: SchnorrJubjubVerificationMethod,
                                     mutation_0: MapMutation,
                                     controllerSignature_0: Schnorr_SchnorrSignature,
                                     expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeSchnorrJubjubVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                                        methodId_0: string,
                                        controllerSignature_0: Schnorr_SchnorrSignature,
                                        expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verifySchnorrJubjubDigestSignature(context: __compactRuntime.CircuitContext<PS>,
                                     methodId_0: string,
                                     digest_0: bigint[],
                                     signature_0: Schnorr_SchnorrSignature): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setVerificationMethodRelation(context: __compactRuntime.CircuitContext<PS>,
                                relation_0: VerificationMethodRelation,
                                methodId_0: string,
                                mutation_0: SetMutation,
                                controllerSignature_0: Schnorr_SchnorrSignature,
                                expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setService(context: __compactRuntime.CircuitContext<PS>,
             service_0: Service,
             mutation_0: MapMutation,
             controllerSignature_0: Schnorr_SchnorrSignature,
             expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeService(context: __compactRuntime.CircuitContext<PS>,
                serviceId_0: string,
                controllerSignature_0: Schnorr_SchnorrSignature,
                expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  deactivate(context: __compactRuntime.CircuitContext<PS>,
             controllerSignature_0: Schnorr_SchnorrSignature,
             expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  rotateControllerKey(context: __compactRuntime.CircuitContext<PS>,
                      newControllerPublicKey_0: __compactRuntime.JubjubPoint,
                      controllerSignature_0: Schnorr_SchnorrSignature,
                      expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  recoverControllerKey(context: __compactRuntime.CircuitContext<PS>,
                       newControllerPublicKey_0: __compactRuntime.JubjubPoint,
                       recoverySignature_0: Schnorr_SchnorrSignature,
                       expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setAlsoKnownAs(context: __compactRuntime.CircuitContext<PS>,
                 value_0: string,
                 mutation_0: SetMutation,
                 controllerSignature_0: Schnorr_SchnorrSignature,
                 expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                        verificationMethod_0: VerificationMethod,
                        mutation_0: MapMutation,
                        controllerSignature_0: Schnorr_SchnorrSignature,
                        expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                           methodId_0: string,
                           controllerSignature_0: Schnorr_SchnorrSignature,
                           expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setSchnorrJubjubVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                                     verificationMethod_0: SchnorrJubjubVerificationMethod,
                                     mutation_0: MapMutation,
                                     controllerSignature_0: Schnorr_SchnorrSignature,
                                     expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeSchnorrJubjubVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                                        methodId_0: string,
                                        controllerSignature_0: Schnorr_SchnorrSignature,
                                        expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verifySchnorrJubjubDigestSignature(context: __compactRuntime.CircuitContext<PS>,
                                     methodId_0: string,
                                     digest_0: bigint[],
                                     signature_0: Schnorr_SchnorrSignature): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setVerificationMethodRelation(context: __compactRuntime.CircuitContext<PS>,
                                relation_0: VerificationMethodRelation,
                                methodId_0: string,
                                mutation_0: SetMutation,
                                controllerSignature_0: Schnorr_SchnorrSignature,
                                expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setService(context: __compactRuntime.CircuitContext<PS>,
             service_0: Service,
             mutation_0: MapMutation,
             controllerSignature_0: Schnorr_SchnorrSignature,
             expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeService(context: __compactRuntime.CircuitContext<PS>,
                serviceId_0: string,
                controllerSignature_0: Schnorr_SchnorrSignature,
                expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  deactivate(context: __compactRuntime.CircuitContext<PS>,
             controllerSignature_0: Schnorr_SchnorrSignature,
             expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
  controllerAuthorizationDigest(contractId_0: { bytes: Uint8Array },
                                expectedVersion_0: bigint,
                                operationHash_0: bigint,
                                argsHash_0: bigint): bigint[];
  rotateControllerKeyAuthorizationDigest(contractId_0: { bytes: Uint8Array },
                                         expectedVersion_0: bigint,
                                         newControllerPublicKey_0: __compactRuntime.JubjubPoint): bigint[];
  recoverControllerKeyAuthorizationDigest(contractId_0: { bytes: Uint8Array },
                                          expectedVersion_0: bigint,
                                          newControllerPublicKey_0: __compactRuntime.JubjubPoint): bigint[];
  setAlsoKnownAsAuthorizationDigest(contractId_0: { bytes: Uint8Array },
                                    expectedVersion_0: bigint,
                                    value_0: string,
                                    mutation_0: SetMutation): bigint[];
  setVerificationMethodAuthorizationDigest(contractId_0: { bytes: Uint8Array },
                                           expectedVersion_0: bigint,
                                           verificationMethod_0: VerificationMethod,
                                           mutation_0: MapMutation): bigint[];
  removeVerificationMethodAuthorizationDigest(contractId_0: { bytes: Uint8Array
                                                            },
                                              expectedVersion_0: bigint,
                                              id_0: string): bigint[];
  setSchnorrJubjubVerificationMethodAuthorizationDigest(contractId_0: { bytes: Uint8Array
                                                                      },
                                                        expectedVersion_0: bigint,
                                                        verificationMethod_0: SchnorrJubjubVerificationMethod,
                                                        mutation_0: MapMutation): bigint[];
  removeSchnorrJubjubVerificationMethodAuthorizationDigest(contractId_0: { bytes: Uint8Array
                                                                         },
                                                           expectedVersion_0: bigint,
                                                           id_0: string): bigint[];
  setVerificationMethodRelationAuthorizationDigest(contractId_0: { bytes: Uint8Array
                                                                 },
                                                   expectedVersion_0: bigint,
                                                   relation_0: VerificationMethodRelation,
                                                   methodId_0: string,
                                                   mutation_0: SetMutation): bigint[];
  setServiceAuthorizationDigest(contractId_0: { bytes: Uint8Array },
                                expectedVersion_0: bigint,
                                service_0: Service,
                                mutation_0: MapMutation): bigint[];
  removeServiceAuthorizationDigest(contractId_0: { bytes: Uint8Array },
                                   expectedVersion_0: bigint,
                                   id_0: string): bigint[];
  deactivateAuthorizationDigest(contractId_0: { bytes: Uint8Array },
                                expectedVersion_0: bigint): bigint[];
}

export type Circuits<PS> = {
  controllerAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                contractId_0: { bytes: Uint8Array },
                                expectedVersion_0: bigint,
                                operationHash_0: bigint,
                                argsHash_0: bigint): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  rotateControllerKeyAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                         contractId_0: { bytes: Uint8Array },
                                         expectedVersion_0: bigint,
                                         newControllerPublicKey_0: __compactRuntime.JubjubPoint): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  recoverControllerKeyAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                          contractId_0: { bytes: Uint8Array },
                                          expectedVersion_0: bigint,
                                          newControllerPublicKey_0: __compactRuntime.JubjubPoint): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  setAlsoKnownAsAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                    contractId_0: { bytes: Uint8Array },
                                    expectedVersion_0: bigint,
                                    value_0: string,
                                    mutation_0: SetMutation): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  setVerificationMethodAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                           contractId_0: { bytes: Uint8Array },
                                           expectedVersion_0: bigint,
                                           verificationMethod_0: VerificationMethod,
                                           mutation_0: MapMutation): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  removeVerificationMethodAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                              contractId_0: { bytes: Uint8Array
                                                            },
                                              expectedVersion_0: bigint,
                                              id_0: string): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  setSchnorrJubjubVerificationMethodAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                                        contractId_0: { bytes: Uint8Array
                                                                      },
                                                        expectedVersion_0: bigint,
                                                        verificationMethod_0: SchnorrJubjubVerificationMethod,
                                                        mutation_0: MapMutation): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  removeSchnorrJubjubVerificationMethodAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                                           contractId_0: { bytes: Uint8Array
                                                                         },
                                                           expectedVersion_0: bigint,
                                                           id_0: string): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  setVerificationMethodRelationAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                                   contractId_0: { bytes: Uint8Array
                                                                 },
                                                   expectedVersion_0: bigint,
                                                   relation_0: VerificationMethodRelation,
                                                   methodId_0: string,
                                                   mutation_0: SetMutation): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  setServiceAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                contractId_0: { bytes: Uint8Array },
                                expectedVersion_0: bigint,
                                service_0: Service,
                                mutation_0: MapMutation): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  removeServiceAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                   contractId_0: { bytes: Uint8Array },
                                   expectedVersion_0: bigint,
                                   id_0: string): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  deactivateAuthorizationDigest(context: __compactRuntime.CircuitContext<PS>,
                                contractId_0: { bytes: Uint8Array },
                                expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, bigint[]>>;
  rotateControllerKey(context: __compactRuntime.CircuitContext<PS>,
                      newControllerPublicKey_0: __compactRuntime.JubjubPoint,
                      controllerSignature_0: Schnorr_SchnorrSignature,
                      expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  recoverControllerKey(context: __compactRuntime.CircuitContext<PS>,
                       newControllerPublicKey_0: __compactRuntime.JubjubPoint,
                       recoverySignature_0: Schnorr_SchnorrSignature,
                       expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setAlsoKnownAs(context: __compactRuntime.CircuitContext<PS>,
                 value_0: string,
                 mutation_0: SetMutation,
                 controllerSignature_0: Schnorr_SchnorrSignature,
                 expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                        verificationMethod_0: VerificationMethod,
                        mutation_0: MapMutation,
                        controllerSignature_0: Schnorr_SchnorrSignature,
                        expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                           methodId_0: string,
                           controllerSignature_0: Schnorr_SchnorrSignature,
                           expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setSchnorrJubjubVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                                     verificationMethod_0: SchnorrJubjubVerificationMethod,
                                     mutation_0: MapMutation,
                                     controllerSignature_0: Schnorr_SchnorrSignature,
                                     expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeSchnorrJubjubVerificationMethod(context: __compactRuntime.CircuitContext<PS>,
                                        methodId_0: string,
                                        controllerSignature_0: Schnorr_SchnorrSignature,
                                        expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verifySchnorrJubjubDigestSignature(context: __compactRuntime.CircuitContext<PS>,
                                     methodId_0: string,
                                     digest_0: bigint[],
                                     signature_0: Schnorr_SchnorrSignature): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setVerificationMethodRelation(context: __compactRuntime.CircuitContext<PS>,
                                relation_0: VerificationMethodRelation,
                                methodId_0: string,
                                mutation_0: SetMutation,
                                controllerSignature_0: Schnorr_SchnorrSignature,
                                expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  setService(context: __compactRuntime.CircuitContext<PS>,
             service_0: Service,
             mutation_0: MapMutation,
             controllerSignature_0: Schnorr_SchnorrSignature,
             expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  removeService(context: __compactRuntime.CircuitContext<PS>,
                serviceId_0: string,
                controllerSignature_0: Schnorr_SchnorrSignature,
                expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  deactivate(context: __compactRuntime.CircuitContext<PS>,
             controllerSignature_0: Schnorr_SchnorrSignature,
             expectedVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
  readonly contractVersion: bigint;
  readonly controllerPublicKey: __compactRuntime.JubjubPoint;
  readonly recoveryAuthorityPublicKey: __compactRuntime.JubjubPoint;
  readonly id: { bytes: Uint8Array };
  alsoKnownAs: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: string): boolean;
    [Symbol.iterator](): Iterator<string>
  };
  readonly version: bigint;
  readonly created: bigint;
  readonly updated: bigint;
  readonly deactivated: boolean;
  readonly active: boolean;
  readonly operationCount: bigint;
  verificationMethods: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: string): boolean;
    lookup(key_0: string): VerificationMethod;
    [Symbol.iterator](): Iterator<[string, VerificationMethod]>
  };
  schnorrJubjubVerificationMethods: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: string): boolean;
    lookup(key_0: string): SchnorrJubjubVerificationMethod;
    [Symbol.iterator](): Iterator<[string, SchnorrJubjubVerificationMethod]>
  };
  authenticationRelation: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: string): boolean;
    [Symbol.iterator](): Iterator<string>
  };
  assertionMethodRelation: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: string): boolean;
    [Symbol.iterator](): Iterator<string>
  };
  keyAgreementRelation: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: string): boolean;
    [Symbol.iterator](): Iterator<string>
  };
  capabilityInvocationRelation: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: string): boolean;
    [Symbol.iterator](): Iterator<string>
  };
  capabilityDelegationRelation: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: string): boolean;
    [Symbol.iterator](): Iterator<string>
  };
  services: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: string): boolean;
    lookup(key_0: string): Service;
    [Symbol.iterator](): Iterator<[string, Service]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;

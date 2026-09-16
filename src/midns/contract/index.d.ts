import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum AddressType { ContractAddr = 0, ZswapCPKAddr = 1, UnshieldedAddr = 2
}

export type DomainData = { owner_public_key: Uint8Array;
                           owner_address: { bytes: Uint8Array };
                           target: Uint8Array;
                           target_type: AddressType;
                           default_field: Maybe<string>;
                           payment_config: PaymentConfig;
                           target_locked: boolean;
                           payment_config_locked: boolean
                         };

export type DomainReference = { domain: Uint8Array; parent_id: bigint };

export type Maybe<T> = { is_some: boolean; value: T };

export type PaymentConfig = { cost_short: bigint;
                              cost_med: bigint;
                              cost_long: bigint;
                              coin_color: Uint8Array;
                              buy_enabled: boolean
                            };

export type Witnesses<PS> = {
  domainSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  change_root_enable_subdomains(context: __compactRuntime.CircuitContext<PS>,
                                b_0: boolean): Promise<__compactRuntime.CircuitResults<PS, []>>;
  change_field_limit(context: __compactRuntime.CircuitContext<PS>,
                     val_0: Maybe<bigint>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  create_domain(context: __compactRuntime.CircuitContext<PS>,
                owner_address_0: { bytes: Uint8Array },
                domain_0: Uint8Array,
                len_0: bigint,
                parent_id_0: bigint,
                target_0: Uint8Array,
                target_type_0: AddressType,
                default_field_0: Maybe<string>,
                payment_config_0: PaymentConfig,
                kvs_0: Maybe<[string, string]>[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_target(context: __compactRuntime.CircuitContext<PS>,
                id_0: bigint,
                target_0: Uint8Array,
                target_type_0: AddressType): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_payment_config(context: __compactRuntime.CircuitContext<PS>,
                        id_0: bigint,
                        pc_0: PaymentConfig): Promise<__compactRuntime.CircuitResults<PS, []>>;
  transfer_domain(context: __compactRuntime.CircuitContext<PS>,
                  domain_0: Uint8Array,
                  parent_id_0: bigint,
                  new_owner_0: Uint8Array,
                  new_owner_address_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  add_domain_field(context: __compactRuntime.CircuitContext<PS>,
                   id_0: bigint,
                   k_0: string,
                   v_0: string): Promise<__compactRuntime.CircuitResults<PS, []>>;
  add_multiple_fields(context: __compactRuntime.CircuitContext<PS>,
                      id_0: bigint,
                      kvs_0: Maybe<[string, string]>[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  remove_domain_field(context: __compactRuntime.CircuitContext<PS>,
                      id_0: bigint,
                      k_0: string): Promise<__compactRuntime.CircuitResults<PS, []>>;
  clear_domain_fields(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_domain_default_field(context: __compactRuntime.CircuitContext<PS>,
                              id_0: bigint,
                              d_0: Maybe<string>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  lock_target(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  lock_payment_config(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  change_root_enable_subdomains(context: __compactRuntime.CircuitContext<PS>,
                                b_0: boolean): Promise<__compactRuntime.CircuitResults<PS, []>>;
  change_field_limit(context: __compactRuntime.CircuitContext<PS>,
                     val_0: Maybe<bigint>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  create_domain(context: __compactRuntime.CircuitContext<PS>,
                owner_address_0: { bytes: Uint8Array },
                domain_0: Uint8Array,
                len_0: bigint,
                parent_id_0: bigint,
                target_0: Uint8Array,
                target_type_0: AddressType,
                default_field_0: Maybe<string>,
                payment_config_0: PaymentConfig,
                kvs_0: Maybe<[string, string]>[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_target(context: __compactRuntime.CircuitContext<PS>,
                id_0: bigint,
                target_0: Uint8Array,
                target_type_0: AddressType): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_payment_config(context: __compactRuntime.CircuitContext<PS>,
                        id_0: bigint,
                        pc_0: PaymentConfig): Promise<__compactRuntime.CircuitResults<PS, []>>;
  transfer_domain(context: __compactRuntime.CircuitContext<PS>,
                  domain_0: Uint8Array,
                  parent_id_0: bigint,
                  new_owner_0: Uint8Array,
                  new_owner_address_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  add_domain_field(context: __compactRuntime.CircuitContext<PS>,
                   id_0: bigint,
                   k_0: string,
                   v_0: string): Promise<__compactRuntime.CircuitResults<PS, []>>;
  add_multiple_fields(context: __compactRuntime.CircuitContext<PS>,
                      id_0: bigint,
                      kvs_0: Maybe<[string, string]>[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  remove_domain_field(context: __compactRuntime.CircuitContext<PS>,
                      id_0: bigint,
                      k_0: string): Promise<__compactRuntime.CircuitResults<PS, []>>;
  clear_domain_fields(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_domain_default_field(context: __compactRuntime.CircuitContext<PS>,
                              id_0: bigint,
                              d_0: Maybe<string>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  lock_target(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  lock_payment_config(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  change_root_enable_subdomains(context: __compactRuntime.CircuitContext<PS>,
                                b_0: boolean): Promise<__compactRuntime.CircuitResults<PS, []>>;
  change_field_limit(context: __compactRuntime.CircuitContext<PS>,
                     val_0: Maybe<bigint>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  create_domain(context: __compactRuntime.CircuitContext<PS>,
                owner_address_0: { bytes: Uint8Array },
                domain_0: Uint8Array,
                len_0: bigint,
                parent_id_0: bigint,
                target_0: Uint8Array,
                target_type_0: AddressType,
                default_field_0: Maybe<string>,
                payment_config_0: PaymentConfig,
                kvs_0: Maybe<[string, string]>[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_target(context: __compactRuntime.CircuitContext<PS>,
                id_0: bigint,
                target_0: Uint8Array,
                target_type_0: AddressType): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_payment_config(context: __compactRuntime.CircuitContext<PS>,
                        id_0: bigint,
                        pc_0: PaymentConfig): Promise<__compactRuntime.CircuitResults<PS, []>>;
  transfer_domain(context: __compactRuntime.CircuitContext<PS>,
                  domain_0: Uint8Array,
                  parent_id_0: bigint,
                  new_owner_0: Uint8Array,
                  new_owner_address_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  add_domain_field(context: __compactRuntime.CircuitContext<PS>,
                   id_0: bigint,
                   k_0: string,
                   v_0: string): Promise<__compactRuntime.CircuitResults<PS, []>>;
  add_multiple_fields(context: __compactRuntime.CircuitContext<PS>,
                      id_0: bigint,
                      kvs_0: Maybe<[string, string]>[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  remove_domain_field(context: __compactRuntime.CircuitContext<PS>,
                      id_0: bigint,
                      k_0: string): Promise<__compactRuntime.CircuitResults<PS, []>>;
  clear_domain_fields(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  update_domain_default_field(context: __compactRuntime.CircuitContext<PS>,
                              id_0: bigint,
                              d_0: Maybe<string>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  lock_target(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  lock_payment_config(context: __compactRuntime.CircuitContext<PS>, id_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
  readonly ROOT_ZONE_ID: bigint;
  readonly TLD: string;
  readonly last_id_int: bigint;
  name_to_id: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: DomainReference): boolean;
    lookup(key_0: DomainReference): bigint;
    [Symbol.iterator](): Iterator<[DomainReference, bigint]>
  };
  id_to_data: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): DomainData;
    [Symbol.iterator](): Iterator<[bigint, DomainData]>
  };
  addr_to_domains: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): {
      isEmpty(): boolean;
      size(): bigint;
      member(elem_0: DomainReference): boolean;
      [Symbol.iterator](): Iterator<DomainReference>
    }
  };
  domain_fields: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): {
      isEmpty(): boolean;
      size(): bigint;
      member(key_1: string): boolean;
      lookup(key_1: string): string;
      [Symbol.iterator](): Iterator<[string, string]>
    }
  };
  readonly ENABLE_SUBDOMAINS: boolean;
  readonly FIELD_LIMIT: Maybe<bigint>;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               tld_0: string,
               target_0: Uint8Array,
               target_type_0: AddressType,
               default_field_0: Maybe<string>,
               payment_config_0: PaymentConfig,
               owner_address_0: { bytes: Uint8Array },
               kvs_0: Maybe<[string, string]>[],
               field_limit_0: Maybe<bigint>,
               enable_subdomains_0: boolean): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;

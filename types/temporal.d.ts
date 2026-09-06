// types/temporal.d.ts
import { Temporal as TemporalNS } from "temporal-polyfill";

declare global {
  export import Temporal = TemporalNS;
}

export {};

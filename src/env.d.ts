interface ImportMetaEnv {
  /** "true" on the production deploy only: registers the service worker. */
  readonly PUBLIC_ENABLE_SW?: string;
  /** Build identifier (commit SHA) used to version the service-worker cache. */
  readonly PUBLIC_BUILD_ID?: string;
  /** "true" to include the example tutorials used by the integration tests. */
  readonly INCLUDE_EXAMPLES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

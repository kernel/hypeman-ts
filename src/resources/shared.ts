// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface SnapshotCompressionConfig {
  /**
   * Enable snapshot memory compression
   */
  enabled: boolean;

  /**
   * Compression algorithm (defaults to zstd when enabled). Ignored when enabled is
   * false.
   */
  algorithm?: 'zstd' | 'lz4';

  /**
   * Compression level. Allowed ranges are zstd=1-19 and lz4=0-9. When omitted, zstd
   * defaults to 1 and lz4 defaults to 0. Ignored when enabled is false.
   */
  level?: number;
}

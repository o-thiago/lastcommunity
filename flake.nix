{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    process-compose-flake.url = "github:Platonic-Systems/process-compose-flake";
    services-flake.url = "github:juspay/services-flake";
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
  };

  outputs =
    { flake-parts, process-compose-flake, ... }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        process-compose-flake.flakeModule
      ];

      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];

      perSystem =
        { pkgs, ... }:
        {
          process-compose.lastcommunity = {
            services.postgres."pg1" = {
              enable = true;
              port = 5433;
              initialScript.before = ''
                CREATE USER root WITH password 'root';
                ALTER USER root WITH SUPERUSER;
              '';
              initialDatabases = [
                {
                  name = "local";
                }
              ];
            };
            imports = [
              inputs.services-flake.processComposeModules.default
            ];
          };

          devShells.default = pkgs.mkShell {
            packages = (
              with pkgs;
              [
                nixfmt-rfc-style
                bun
              ]
            );
          };
        };
    };
}

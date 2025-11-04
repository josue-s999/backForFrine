{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # Or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript-language-server
  ];
  # Sets environment variables in the workspace
  env = {};
  # Services to make available in the preview window
  services = {
    # Example:
    # web-server = {
    #   command = "npm run start";
    #   port = 8080;
    # };
    postgres = {
      enable = true;
      package = pkgs.postgresql;
      extensions = [ pkgs.postgis ];
    };
  };
  #
  # More info: https://developers.google.com/idx/guides/customize-idx-env
}
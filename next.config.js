module.exports = {
    async rewrites() {
      return [
        {
          source: "/recipes/:path*",
          destination: "/recipes/:path*",
        },
      ];
    },
  };

  
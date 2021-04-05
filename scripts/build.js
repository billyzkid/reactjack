import snowpack from 'snowpack';

async function build() {
  const snowpackConfig = await snowpack.loadConfiguration('snowpack.config.js');
  const snowpackBuildResult = await snowpack.build({ config: snowpackConfig });

  if (!snowpackConfig.buildOptions.watch) {
    process.exit();
  }
}

build();

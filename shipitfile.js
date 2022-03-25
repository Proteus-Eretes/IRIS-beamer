module.exports = (shipit) => {
  require('shipit-deploy')(shipit);

  shipit.task('copyConfig', async () => {
    const date = new Date();
    await shipit.copyToRemote(
      'dist/',
      `/srv/beamer.poweredbyiris.nl/releases/${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`,
    );
    await shipit.remote(`ln -snf releases/${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()} /srv/beamer.poweredbyiris.nl/current`);
  });

  shipit.initConfig({
    default: {
      deployTo: '/srv/beamer.poweredbyiris.nl',
      repositoryUrl: 'https://github.com/Proteus-Eretes/IRIS-beamer.git',
    },
    live: {
      servers: 'dev@beamer.hoesnelwasik.nl',
    },
  });
};

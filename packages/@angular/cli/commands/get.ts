import {CliConfig} from '../models/config';

const SilentError = require('silent-error');
const Command = require('../ember-cli/lib/models/command');


export interface GetOptions {
  global?: boolean;
}


const GetCommand = Command.extend({
  name: 'get',
  description: 'Get a value from the configuration. Example: ng get project.name',
  works: 'everywhere',

  availableOptions: [
    {
      name: 'global',
      type: Boolean,
      'default': false,
      description: 'Get the value in the global configuration (in your home directory).'
    }
  ],

  run: function (commandOptions: GetOptions, rawArgs: string[]): Promise<void> {
    return new Promise<void>(resolve => {
      const config = commandOptions.global ? CliConfig.fromGlobal() : CliConfig.fromProject();

      if (config === null) {
        throw new SilentError('No config found. If you want to use global configuration, '
          + 'you need the --global argument.');
      }

      if (!rawArgs[0]) {
        throw new SilentError('No key specified. Run "ng help get" for usage.');
      }

      const value = config.get(rawArgs[0]);

      if (value === null || value === undefined) {
        throw new SilentError('Value cannot be found.');
      } else if (typeof value == 'object') {
        console.log(JSON.stringify(value));
      } else {
        console.log(value);
      }
      resolve();
    });
  }
});

export default GetCommand;

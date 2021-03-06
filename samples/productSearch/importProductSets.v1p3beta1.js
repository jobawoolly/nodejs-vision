/**
 * Copyright 2018, Google, LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
// [START vision_product_search_import_product_images]
function importProductSets(projectId, location, gcsUri) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision').v1p3beta1;
  // Creates a client
  const client = new vision.ProductSearchClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const projectId = 'Your Google Cloud project Id';
  // const location = 'A compute region name';
  // const gcsUri = 'Google Cloud Storage path of the input image'';

  // A resource that represents Google Cloud Platform location.
  const projectLocation = client.locationPath(projectId, location);

  // Set the input configuration along with Google Cloud Storage URI
  const inputConfig = {
    gcsSource: {
      csvFileUri: gcsUri,
    },
  };

  // Import the product sets from the input URI.
  client
    .importProductSets({parent: projectLocation, inputConfig: inputConfig})
    .then(responses => {
      const response = responses[0];
      const operation = responses[1];
      console.log('Processing operation name: ', operation.name);

      // synchronous check of operation status
      return response.promise();
    })
    .then(responses => {
      console.log('Processing done.');
      console.log('Results of the processing:');

      for (const i in responses[0].statuses) {
        console.log(
          'Status of processing ',
          i,
          'of the csv:',
          responses[0].statuses[i]
        );

        // Check the status of reference image
        if (responses[0].statuses[i].code === 0) {
          console.log(responses[0].referenceImages[i]);
        } else {
          console.log('No reference image.');
        }
      }
    })
    .catch(err => {
      console.error(err);
    });
  // [END vision_product_search_import_product_images]
}
// [END vision_product_search_import_product_set]

require(`yargs`) // eslint-disable-line
  .demand(1)
  .command(
    `importProductSets <projectId> <location> <gcsUri>`,
    `Import a Product Set`,
    {},
    opts => importProductSets(opts.projectId, opts.location, opts.gcsUri)
  )
  .example(`node $0 COMMAND ARG`)
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/vision/docs`)
  .help()
  .strict().argv;

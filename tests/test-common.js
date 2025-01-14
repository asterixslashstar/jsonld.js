/**
 * Common test runner for JSON-LD.
 *
 * @author Dave Longley
 * @author David I. Lehn
 *
 * Copyright (c) 2011-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* eslint-disable indent */
const EarlReport = require('./earl-report');
const benchmark = require('benchmark');
const join = require('join-path-js');
const rdfCanonize = require('rdf-canonize');

module.exports = function(options) {

'use strict';

const assert = options.assert;
const jsonld = options.jsonld;

const manifest = options.manifest || {
  '@context': 'https://json-ld.org/test-suite/context.jsonld',
  '@id': '',
  '@type': 'mf:Manifest',
  description: 'Top level jsonld.js manifest',
  name: 'jsonld.js',
  sequence: options.entries || [],
  filename: '/'
};

const TEST_TYPES = {
  'jld:CompactTest': {
    skip: {
      // skip tests where behavior changed for a 1.1 processor
      // see JSON-LD 1.0 Errata
      specVersion: ['json-ld-1.0'],
      // FIXME
      idRegex: [
        // list of lists
        /compact-manifest.jsonld#tli01$/,
        /compact-manifest.jsonld#tli02$/,
        /compact-manifest.jsonld#tli03$/,
        /compact-manifest.jsonld#tli04$/,
        /compact-manifest.jsonld#tli05$/,
        // terms
        /compact-manifest.jsonld#tp001$/,
        // rel iri
        /compact-manifest.jsonld#t0095$/,
        // type set
        /compact-manifest.jsonld#t0104$/,
        /compact-manifest.jsonld#t0105$/,
        // rel vocab
        /compact-manifest.jsonld#t0107$/,
        // html
        /compact-manifest.jsonld#th001$/,
        /compact-manifest.jsonld#th002$/,
        /compact-manifest.jsonld#th003$/,
        /compact-manifest.jsonld#th004$/,
        // @type: @none
        /compact-manifest.jsonld#ttn01$/,
        /compact-manifest.jsonld#ttn02$/,
        /compact-manifest.jsonld#ttn03$/,
        // property-valued indexes
        /compact-manifest.jsonld#tpi01$/,
        /compact-manifest.jsonld#tpi02$/,
        /compact-manifest.jsonld#tpi03$/,
        /compact-manifest.jsonld#tpi04$/,
        /compact-manifest.jsonld#tpi05$/,
        /compact-manifest.jsonld#tpi06$/,
        // JSON literals
        /compact-manifest.jsonld#tjs01$/,
        /compact-manifest.jsonld#tjs02$/,
        /compact-manifest.jsonld#tjs03$/,
        /compact-manifest.jsonld#tjs04$/,
        /compact-manifest.jsonld#tjs05$/,
        /compact-manifest.jsonld#tjs06$/,
        /compact-manifest.jsonld#tjs07$/,
        /compact-manifest.jsonld#tjs08$/,
        /compact-manifest.jsonld#tjs09$/,
        // IRI confusion
        /compact-manifest.jsonld#te002$/,
        // @propogate
        /compact-manifest.jsonld#tc026$/,
        /compact-manifest.jsonld#tc027$/,
        // included
        /compact-manifest.jsonld#tin01$/,
        /compact-manifest.jsonld#tin02$/,
        /compact-manifest.jsonld#tin03$/,
        /compact-manifest.jsonld#tin04$/,
        /compact-manifest.jsonld#tin05$/,
        // index on @type
        /compact-manifest.jsonld#tm020$/,
        /compact-manifest.jsonld#tm021$/,
        /compact-manifest.jsonld#tm022$/,
        // context values
        /compact-manifest.jsonld#ts001$/,
        /compact-manifest.jsonld#ts002$/,
      ]
    },
    fn: 'compact',
    params: [
      readTestUrl('input'),
      readTestJson('context'),
      createTestOptions()
    ],
    compare: compareExpectedJson
  },
  'jld:ExpandTest': {
    skip: {
      // FIXME
      idRegex: [
        // list of lists
        /expand-manifest.jsonld#tli01$/,
        /expand-manifest.jsonld#tli02$/,
        /expand-manifest.jsonld#tli03$/,
        /expand-manifest.jsonld#tli04$/,
        /expand-manifest.jsonld#tli05$/,
        /expand-manifest.jsonld#tli06$/,
        /expand-manifest.jsonld#tli07$/,
        /expand-manifest.jsonld#tli08$/,
        /expand-manifest.jsonld#tli09$/,
        /expand-manifest.jsonld#tli10$/,
        // mode
        /expand-manifest.jsonld#tp001$/,
        /expand-manifest.jsonld#tp002$/,
        // rel iri
        /expand-manifest.jsonld#t0092$/,
        // iris
        /expand-manifest.jsonld#t0109$/,
        // rel vocab
        /expand-manifest.jsonld#t0110$/,
        /expand-manifest.jsonld#t0111$/,
        /expand-manifest.jsonld#t0112$/,
        // html
        /expand-manifest.jsonld#th001$/,
        /expand-manifest.jsonld#th002$/,
        /expand-manifest.jsonld#th003$/,
        /expand-manifest.jsonld#th004$/,
        /expand-manifest.jsonld#th005$/,
        /expand-manifest.jsonld#th006$/,
        /expand-manifest.jsonld#th007$/,
        /expand-manifest.jsonld#th010$/,
        /expand-manifest.jsonld#th011$/,
        /expand-manifest.jsonld#th012$/,
        /expand-manifest.jsonld#th013$/,
        /expand-manifest.jsonld#th014$/,
        /expand-manifest.jsonld#th015$/,
        /expand-manifest.jsonld#th016$/,
        /expand-manifest.jsonld#th017$/,
        /expand-manifest.jsonld#th018$/,
        /expand-manifest.jsonld#th019$/,
        /expand-manifest.jsonld#th020$/,
        /expand-manifest.jsonld#th021$/,
        /expand-manifest.jsonld#th022$/,
        // HTML extraction
        /expand-manifest.jsonld#thc01$/,
        /expand-manifest.jsonld#thc02$/,
        /expand-manifest.jsonld#thc03$/,
        /expand-manifest.jsonld#thc04$/,
        /expand-manifest.jsonld#thc05$/,
        // @type: @none
        /expand-manifest.jsonld#ttn02$/,
        // property index maps
        /expand-manifest.jsonld#tpi01$/,
        /expand-manifest.jsonld#tpi02$/,
        /expand-manifest.jsonld#tpi03$/,
        /expand-manifest.jsonld#tpi04$/,
        /expand-manifest.jsonld#tpi05$/,
        /expand-manifest.jsonld#tpi06$/,
        /expand-manifest.jsonld#tpi07$/,
        /expand-manifest.jsonld#tpi08$/,
        /expand-manifest.jsonld#tpi09$/,
        /expand-manifest.jsonld#tpi10$/,
        /expand-manifest.jsonld#tpi11$/,
        // JSON literals
        /expand-manifest.jsonld#tjs01$/,
        /expand-manifest.jsonld#tjs02$/,
        /expand-manifest.jsonld#tjs03$/,
        /expand-manifest.jsonld#tjs04$/,
        /expand-manifest.jsonld#tjs05$/,
        /expand-manifest.jsonld#tjs06$/,
        /expand-manifest.jsonld#tjs07$/,
        /expand-manifest.jsonld#tjs08$/,
        /expand-manifest.jsonld#tjs09$/,
        /expand-manifest.jsonld#tjs10$/,
        /expand-manifest.jsonld#tjs11$/,
        // misc
        /expand-manifest.jsonld#te043$/,
        /expand-manifest.jsonld#te044$/,
        // IRI prefixes
        /expand-manifest.jsonld#tpr29$/,
        // protected null IRI mapping
        /expand-manifest.jsonld#tpr28$/,
        // remote
        /remote-doc-manifest.jsonld#t0005$/,
        /remote-doc-manifest.jsonld#t0006$/,
        /remote-doc-manifest.jsonld#t0007$/,
        /remote-doc-manifest.jsonld#t0010$/,
        /remote-doc-manifest.jsonld#t0011$/,
        /remote-doc-manifest.jsonld#t0012$/,
        /remote-doc-manifest.jsonld#t0013$/,
        /remote-doc-manifest.jsonld#tla01$/,
        /remote-doc-manifest.jsonld#tla05$/,
        // @propogate
        /expand-manifest.jsonld#tc026$/,
        /expand-manifest.jsonld#tc027$/,
        /expand-manifest.jsonld#tc028$/,
        /expand-manifest.jsonld#tc029$/,
        // @import
        /expand-manifest.jsonld#tso01$/,
        /expand-manifest.jsonld#tso02$/,
        /expand-manifest.jsonld#tso03$/,
        /expand-manifest.jsonld#tso05$/,
        /expand-manifest.jsonld#tso06$/,
        // protected
        /expand-manifest.jsonld#tso07$/,
        // context merging
        /expand-manifest.jsonld#tso08$/,
        /expand-manifest.jsonld#tso10$/,
        /expand-manifest.jsonld#tso11$/,
        // colliding keywords
        /expand-manifest.jsonld#t0114$/,
        // vocab iri/term
        /expand-manifest.jsonld#te046$/,
        /expand-manifest.jsonld#te047$/,
        // included
        /expand-manifest.jsonld#tin01$/,
        /expand-manifest.jsonld#tin02$/,
        /expand-manifest.jsonld#tin03$/,
        /expand-manifest.jsonld#tin04$/,
        /expand-manifest.jsonld#tin05$/,
        /expand-manifest.jsonld#tin06$/,
        /expand-manifest.jsonld#tin07$/,
        /expand-manifest.jsonld#tin08$/,
        /expand-manifest.jsonld#tin09$/,
        // index on @type
        /expand-manifest.jsonld#tm017$/,
        /expand-manifest.jsonld#tm020$/,
        // @nest
        /expand-manifest.jsonld#tn008$/,
      ]
    },
    fn: 'expand',
    params: [
      readTestUrl('input'),
      createTestOptions()
    ],
    compare: compareExpectedJson
  },
  'jld:FlattenTest': {
    skip: {
      // FIXME
      idRegex: [
        // list of lists
        /flatten-manifest.jsonld#tli01$/,
        /flatten-manifest.jsonld#tli02$/,
        /flatten-manifest.jsonld#tli03$/,
        // html
        /flatten-manifest.jsonld#th001$/,
        /flatten-manifest.jsonld#th002$/,
        /flatten-manifest.jsonld#th003$/,
        /flatten-manifest.jsonld#th004$/,
        // included
        /flatten-manifest.jsonld#tin01$/,
        /flatten-manifest.jsonld#tin02$/,
        /flatten-manifest.jsonld#tin03$/,
        /flatten-manifest.jsonld#tin04$/,
        /flatten-manifest.jsonld#tin05$/,
        /flatten-manifest.jsonld#tin06$/,
      ]
    },
    fn: 'flatten',
    params: [
      readTestUrl('input'),
      readTestJson('context'),
      createTestOptions()
    ],
    compare: compareExpectedJson
  },
  'jld:FrameTest': {
    skip: {
      // FIXME
      idRegex: [
        // ex
        /frame-manifest.jsonld#tg001$/,
        // graphs
        /frame-manifest.jsonld#t0010$/,
        /frame-manifest.jsonld#t0020$/,
        /frame-manifest.jsonld#t0046$/,
        /frame-manifest.jsonld#t0049$/,
        /frame-manifest.jsonld#t0051$/,
        /frame-manifest.jsonld#tg010$/,
        /frame-manifest.jsonld#tp046$/,
        /frame-manifest.jsonld#tp049$/,
        // blank nodes
        /frame-manifest.jsonld#t0052$/,
        /frame-manifest.jsonld#t0053$/,
        // embed
        /frame-manifest.jsonld#t0054$/,
        // lists
        /frame-manifest.jsonld#t0055$/,
        /frame-manifest.jsonld#t0058$/,
        // misc
        /frame-manifest.jsonld#tp010$/,
        /frame-manifest.jsonld#tp050$/,
        /frame-manifest.jsonld#teo01$/,
        /frame-manifest.jsonld#t0062$/,
        /frame-manifest.jsonld#t0063$/,
        // @embed:@first
        /frame-manifest.jsonld#t0060$/,
        // requireAll
        /frame-manifest.jsonld#tra01$/,
        /frame-manifest.jsonld#tra02$/,
        /frame-manifest.jsonld#tra03$/,
        // wildcard
        /frame-manifest.jsonld#t0061$/,
        // included
        /frame-manifest.jsonld#tin01$/,
        /frame-manifest.jsonld#tin02$/,
        /frame-manifest.jsonld#tin03$/,
      ]
    },
    fn: 'frame',
    params: [
      readTestUrl('input'),
      readTestJson('frame'),
      createTestOptions()
    ],
    compare: compareExpectedJson
  },
  'jld:FromRDFTest': {
    skip: {
      // FIXME
      idRegex: [
        // list of lists
        /fromRdf-manifest.jsonld#tli01$/,
        /fromRdf-manifest.jsonld#tli02$/,
        /fromRdf-manifest.jsonld#tli03$/,
        // JSON literals
        /fromRdf-manifest.jsonld#tjs01$/,
        /fromRdf-manifest.jsonld#tjs02$/,
        /fromRdf-manifest.jsonld#tjs03$/,
        /fromRdf-manifest.jsonld#tjs04$/,
        /fromRdf-manifest.jsonld#tjs05$/,
        /fromRdf-manifest.jsonld#tjs06$/,
        /fromRdf-manifest.jsonld#tjs07$/,
      ]
    },
    fn: 'fromRDF',
    params: [
      readTestNQuads('input'),
      createTestOptions({format: 'application/n-quads'})
    ],
    compare: compareExpectedJson
  },
  'jld:NormalizeTest': {
    fn: 'normalize',
    params: [
      readTestUrl('input'),
      createTestOptions({format: 'application/n-quads'})
    ],
    compare: compareExpectedNQuads
  },
  'jld:ToRDFTest': {
    skip: {
      // FIXME
      idRegex: [
        // list of lists
        /toRdf-manifest.jsonld#tli01$/,
        /toRdf-manifest.jsonld#tli02$/,
        // blank node properties
        /toRdf-manifest.jsonld#t0118$/,
        // well formed
        /toRdf-manifest.jsonld#twf01$/,
        /toRdf-manifest.jsonld#twf02$/,
        /toRdf-manifest.jsonld#twf03$/,
        /toRdf-manifest.jsonld#twf04$/,
        /toRdf-manifest.jsonld#twf05$/,
        /toRdf-manifest.jsonld#twf06$/,
        /toRdf-manifest.jsonld#twf07$/,
        // html
        /toRdf-manifest.jsonld#th001$/,
        /toRdf-manifest.jsonld#th002$/,
        /toRdf-manifest.jsonld#th003$/,
        /toRdf-manifest.jsonld#th004$/,
        /toRdf-manifest.jsonld#th005$/,
        /toRdf-manifest.jsonld#th006$/,
        /toRdf-manifest.jsonld#th007$/,
        /toRdf-manifest.jsonld#th010$/,
        /toRdf-manifest.jsonld#th011$/,
        /toRdf-manifest.jsonld#th012$/,
        /toRdf-manifest.jsonld#th013$/,
        /toRdf-manifest.jsonld#th014$/,
        /toRdf-manifest.jsonld#th015$/,
        /toRdf-manifest.jsonld#th016$/,
        /toRdf-manifest.jsonld#th017$/,
        /toRdf-manifest.jsonld#th018$/,
        /toRdf-manifest.jsonld#th019$/,
        /toRdf-manifest.jsonld#th020$/,
        /toRdf-manifest.jsonld#th021$/,
        /toRdf-manifest.jsonld#th022$/,
        // JSON literal
        /toRdf-manifest.jsonld#tjs01$/,
        /toRdf-manifest.jsonld#tjs02$/,
        /toRdf-manifest.jsonld#tjs03$/,
        /toRdf-manifest.jsonld#tjs04$/,
        /toRdf-manifest.jsonld#tjs05$/,
        /toRdf-manifest.jsonld#tjs06$/,
        /toRdf-manifest.jsonld#tjs07$/,
        /toRdf-manifest.jsonld#tjs08$/,
        /toRdf-manifest.jsonld#tjs09$/,
        /toRdf-manifest.jsonld#tjs10$/,
        /toRdf-manifest.jsonld#tjs11$/,
        /toRdf-manifest.jsonld#tjs12$/,
        /toRdf-manifest.jsonld#tjs13$/,
        // number fixes
        /toRdf-manifest.jsonld#trt01$/,
        // IRI resolution
        /toRdf-manifest.jsonld#t0130$/,
        /toRdf-manifest.jsonld#t0131$/,
        /toRdf-manifest.jsonld#t0132$/,
        // @vocab mapping
        /toRdf-manifest.jsonld#te075$/,
        // rel IRI
        /toRdf-manifest.jsonld#te092$/,
        /toRdf-manifest.jsonld#te109$/,
        /toRdf-manifest.jsonld#te110$/,
        /toRdf-manifest.jsonld#te111$/,
        /toRdf-manifest.jsonld#te112$/,
        // processing
        /toRdf-manifest.jsonld#tp001$/,
        /toRdf-manifest.jsonld#tp002$/,
        // index maps
        /toRdf-manifest.jsonld#tpi05$/,
        /toRdf-manifest.jsonld#tpi06$/,
        /toRdf-manifest.jsonld#tpi07$/,
        /toRdf-manifest.jsonld#tpi08$/,
        /toRdf-manifest.jsonld#tpi09$/,
        /toRdf-manifest.jsonld#tpi10$/,
        /toRdf-manifest.jsonld#tpi11$/,
        // protected
        /toRdf-manifest.jsonld#tpr28$/,
        // prefix
        /toRdf-manifest.jsonld#tpr29$/,
        // @import
        /toRdf-manifest.jsonld#tso01$/,
        /toRdf-manifest.jsonld#tso02$/,
        /toRdf-manifest.jsonld#tso03$/,
        // @propogate
        /toRdf-manifest.jsonld#tso05$/,
        /toRdf-manifest.jsonld#tso06$/,
        // protected
        /toRdf-manifest.jsonld#tso07$/,
        // context merging
        /toRdf-manifest.jsonld#tso08$/,
        /toRdf-manifest.jsonld#tso10$/,
        /toRdf-manifest.jsonld#tso11$/,
        // type:none
        /toRdf-manifest.jsonld#ttn02$/,
        // colliding keyword
        /toRdf-manifest.jsonld#te114$/,
        // included
        /toRdf-manifest.jsonld#tin01$/,
        /toRdf-manifest.jsonld#tin02$/,
        /toRdf-manifest.jsonld#tin03$/,
        /toRdf-manifest.jsonld#tin04$/,
        /toRdf-manifest.jsonld#tin05$/,
        /toRdf-manifest.jsonld#tin06$/,
        // index on @type
        /toRdf-manifest.jsonld#tm017$/,
        /toRdf-manifest.jsonld#tm020$/,
        // @next
        /toRdf-manifest.jsonld#tn008$/,
      ]
    },
    fn: 'toRDF',
    params: [
      readTestUrl('input'),
      createTestOptions({format: 'application/n-quads'})
    ],
    compare: compareCanonizedExpectedNQuads
  },
  'rdfn:Urgna2012EvalTest': {
    fn: 'normalize',
    params: [
      readTestNQuads('action'),
      createTestOptions({
        algorithm: 'URGNA2012',
        inputFormat: 'application/n-quads',
        format: 'application/n-quads'
      })
    ],
    compare: compareExpectedNQuads
  },
  'rdfn:Urdna2015EvalTest': {
    fn: 'normalize',
    params: [
      readTestNQuads('action'),
      createTestOptions({
        algorithm: 'URDNA2015',
        inputFormat: 'application/n-quads',
        format: 'application/n-quads'
      })
    ],
    compare: compareExpectedNQuads
  }
};

const SKIP_TESTS = [];

// create earl report
if(options.earl && options.earl.filename) {
  options.earl.report = new EarlReport({id: options.earl.id});
}

return new Promise(resolve => {

// async generated tests
// _tests => [{suite}, ...]
// suite => {
//   title: ...,
//   tests: [test, ...],
//   suites: [suite, ...]
// }
const _tests = [];

return addManifest(manifest, _tests)
  .then(() => {
    _testsToMocha(_tests);
  }).then(() => {
    if(options.earl.report) {
      describe('Writing EARL report to: ' + options.earl.filename, function() {
        it('should print the earl report', function() {
          return options.writeFile(
            options.earl.filename, options.earl.report.reportJson());
        });
      });
    }
  }).then(() => resolve());

// build mocha tests from local test structure
function _testsToMocha(tests) {
  tests.forEach(suite => {
    if(suite.skip) {
      describe.skip(suite.title);
      return;
    }
    describe(suite.title, () => {
      suite.tests.forEach(test => {
        if(test.only) {
          it.only(test.title, test.f);
          return;
        }
        it(test.title, test.f);
      });
      _testsToMocha(suite.suites);
    });
    suite.imports.forEach(f => {
      options.import(f);
    });
  });
}

});

/**
 * Adds the tests for all entries in the given manifest.
 *
 * @param manifest {Object} the manifest.
 * @param parent {Object} the parent test structure
 * @return {Promise}
 */
function addManifest(manifest, parent) {
  return new Promise((resolve, reject) => {
    // create test structure
    const suite = {
      title: manifest.name || manifest.label,
      tests: [],
      suites: [],
      imports: []
    };
    parent.push(suite);

    // get entries and sequence (alias for entries)
    const entries = [].concat(
      getJsonLdValues(manifest, 'entries'),
      getJsonLdValues(manifest, 'sequence')
    );

    const includes = getJsonLdValues(manifest, 'include');
    // add includes to sequence as jsonld files
    for(let i = 0; i < includes.length; ++i) {
      entries.push(includes[i] + '.jsonld');
    }

    // resolve all entry promises and process
    Promise.all(entries).then(entries => {
      let p = Promise.resolve();
      entries.forEach(entry => {
        if(typeof entry === 'string' && entry.endsWith('js')) {
          // process later as a plain JavaScript file
          suite.imports.push(entry);
          return;
        } else if(typeof entry === 'function') {
          // process as a function that returns a promise
          p = p.then(() => {
            return entry(options);
          }).then(childSuite => {
            if(suite) {
              suite.suites.push(childSuite);
            }
          });
          return;
        }
        p = p.then(() => {
          return readManifestEntry(manifest, entry);
        }).then(entry => {
          if(isJsonLdType(entry, '__SKIP__')) {
            // special local skip logic
            suite.tests.push(entry);
          } else if(isJsonLdType(entry, 'mf:Manifest')) {
            // entry is another manifest
            return addManifest(entry, suite.suites);
          } else {
            // assume entry is a test
            return addTest(manifest, entry, suite.tests);
          }
        });
      });
      return p;
    }).then(() => {
      resolve();
    }).catch(err => {
      console.error(err);
      reject(err);
    });
  });
}

/**
 * Adds a test.
 *
 * @param manifest {Object} the manifest.
 * @param parent {Object} the test.
 * @param tests {Array} the list of tests to add to.
 * @return {Promise}
 */
function addTest(manifest, test, tests) {
  // expand @id and input base
  const test_id = test['@id'] || test['id'];
  //var number = test_id.substr(2);
  test['@id'] = manifest.baseIri + basename(manifest.filename) + test_id;
  test.base = manifest.baseIri + test.input;
  test.manifest = manifest;
  const description = test_id + ' ' + (test.purpose || test.name);

  const _test = {
    title: description,
    f: makeFn()
  };
  // only based on test manifest
  // skip handled via skip()
  if('only' in test) {
    _test.only = test.only;
  }
  tests.push(_test);

  function makeFn() {
    return async function() {
      const self = this;
      self.timeout(5000);
      const testInfo = TEST_TYPES[getJsonLdTestType(test)];

      // skip based on test manifest
      if('skip' in test && test.skip) {
        if(options.verboseSkip) {
          console.log('Skipping test due to manifest:',
            {id: test['@id'], name: test.name});
        }
        self.skip();
      }

      // skip based on unknown test type
      const testTypes = Object.keys(TEST_TYPES);
      if(!isJsonLdType(test, testTypes)) {
        if(options.verboseSkip) {
          const type = [].concat(
            getJsonLdValues(test, '@type'),
            getJsonLdValues(test, 'type')
          );
          console.log('Skipping test due to unknown type:',
            {id: test['@id'], name: test.name, type});
        }
        self.skip();
      }

      // skip based on test type
      if(isJsonLdType(test, SKIP_TESTS)) {
        if(options.verboseSkip) {
          const type = [].concat(
            getJsonLdValues(test, '@type'),
            getJsonLdValues(test, 'type')
          );
          console.log('Skipping test due to test type:',
            {id: test['@id'], name: test.name, type});
        }
        self.skip();
      }

      // skip based on type info
      if(testInfo.skip && testInfo.skip.type) {
        if(options.verboseSkip) {
          console.log('Skipping test due to type info:',
            {id: test['@id'], name: test.name});
        }
        self.skip();
      }

      // skip based on id regex
      if(testInfo.skip && testInfo.skip.idRegex) {
        testInfo.skip.idRegex.forEach(function(re) {
          if(re.test(test['@id'])) {
            if(options.verboseSkip) {
              console.log('Skipping test due to id:',
                {id: test['@id']});
            }
            self.skip();
          }
        });
      }

      // skip based on description regex
      if(testInfo.skip && testInfo.skip.descriptionRegex) {
        testInfo.skip.descriptionRegex.forEach(function(re) {
          if(re.test(description)) {
            if(options.verboseSkip) {
              console.log('Skipping test due to description:',
                {id: test['@id'], name: test.name, description});
            }
            self.skip();
          }
        });
      }

      const testOptions = getJsonLdValues(test, 'option');

      testOptions.forEach(function(opt) {
        const processingModes = getJsonLdValues(opt, 'processingMode');
        processingModes.forEach(function(pm) {
          let skipModes = [];
          if(testInfo.skip && testInfo.skip.processingMode) {
            skipModes = testInfo.skip.processingMode;
          }
          if(skipModes.indexOf(pm) !== -1) {
            if(options.verboseSkip) {
              console.log('Skipping test due to processingMode:',
                {id: test['@id'], name: test.name, processingMode: pm});
            }
            self.skip();
          }
        });
      });

      testOptions.forEach(function(opt) {
        const specVersions = getJsonLdValues(opt, 'specVersion');
        specVersions.forEach(function(sv) {
          let skipVersions = [];
          if(testInfo.skip && testInfo.skip.specVersion) {
            skipVersions = testInfo.skip.specVersion;
          }
          if(skipVersions.indexOf(sv) !== -1) {
            if(options.verboseSkip) {
              console.log('Skipping test due to specVersion:',
                {id: test['@id'], name: test.name, specVersion: sv});
            }
            self.skip();
          }
        });
      });

      const fn = testInfo.fn;
      const params = testInfo.params.map(param => param(test));
      // resolve test data
      const values = await Promise.all(params);
      let err;
      let result;
      // run and capture errors and results
      try {
        result = await jsonld[fn].apply(null, values);
      } catch(e) {
        err = e;
      }

      try {
        if(isJsonLdType(test, 'jld:NegativeEvaluationTest')) {
          await compareExpectedError(test, err);
        } else if(isJsonLdType(test, 'jld:PositiveEvaluationTest') ||
          isJsonLdType(test, 'rdfn:Urgna2012EvalTest') ||
          isJsonLdType(test, 'rdfn:Urdna2015EvalTest')) {
          if(err) {
            throw err;
          }
          await testInfo.compare(test, result);
        } else if(isJsonLdType(test, 'jld:PositiveSyntaxTest')) {
          // no checks
        } else {
          throw Error('Unknown test type: ' + test.type);
        }

        if(options.benchmark) {
          // pre-load params to avoid doc loader and parser timing
          const benchParams = testInfo.params.map(param => param(test, {
            load: true
          }));
          const benchValues = await Promise.all(benchParams);

          await new Promise((resolve, reject) => {
            const suite = new benchmark.Suite();
            suite.add({
              name: test.name,
              defer: true,
              fn: deferred => {
                jsonld[fn].apply(null, benchValues).then(() => {
                  deferred.resolve();
                });
              }
            });
            suite
              .on('start', e => {
                self.timeout((e.target.maxTime + 2) * 1000);
              })
              .on('cycle', e => {
                console.log(String(e.target));
              })
              .on('error', err => {
                reject(new Error(err));
              })
              .on('complete', () => {
                resolve();
              })
              .run({async: true});
          });
        }

        if(options.earl.report) {
          options.earl.report.addAssertion(test, true);
        }
      } catch(err) {
        if(options.bailOnError) {
          if(err.name !== 'AssertionError') {
            console.error('\nError: ', JSON.stringify(err, null, 2));
          }
          options.exit();
        }
        if(options.earl.report) {
          options.earl.report.addAssertion(test, false);
        }
        console.error('Error: ', JSON.stringify(err, null, 2));
        throw err;
      }
    };
  }
}

function getJsonLdTestType(test) {
  const types = Object.keys(TEST_TYPES);
  for(let i = 0; i < types.length; ++i) {
    if(isJsonLdType(test, types[i])) {
      return types[i];
    }
  }
  return null;
}

function readManifestEntry(manifest, entry) {
  let p = Promise.resolve();
  let _entry = entry;
  if(typeof entry === 'string') {
    let _filename;
    p = p.then(() => {
      if(entry.endsWith('json') || entry.endsWith('jsonld')) {
        // load as file
        return entry;
      }
      // load as dir with manifest.jsonld
      return joinPath(entry, 'manifest.jsonld');
    }).then(entry => {
      const dir = dirname(manifest.filename);
      return joinPath(dir, entry);
    }).then(filename => {
      _filename = filename;
      return readJson(filename);
    }).then(entry => {
      _entry = entry;
      _entry.filename = _filename;
      return _entry;
    }).catch(err => {
      if(err.code === 'ENOENT') {
        //console.log('File does not exist, skipping: ' + _filename);
        // return a "skip" entry
        _entry = {
          type: '__SKIP__',
          title: 'Not found, skipping: ' + _filename,
          filename: _filename,
          skip: true
        };
        return;
      }
      throw err;
    });
  }
  return p.then(() => {
    _entry.dirname = dirname(_entry.filename || manifest.filename);
    return _entry;
  });
}

function readTestUrl(property) {
  return async function(test, options) {
    if(!test[property]) {
      return null;
    }
    if(options && options.load) {
      // always load
      const filename = await joinPath(test.dirname, test[property]);
      return readJson(filename);
    }
    return test.manifest.baseIri + test[property];
  };
}

function readTestJson(property) {
  return async function(test) {
    if(!test[property]) {
      return null;
    }
    const filename = await joinPath(test.dirname, test[property]);
    return readJson(filename);
  };
}

function readTestNQuads(property) {
  return async function(test) {
    if(!test[property]) {
      return null;
    }
    const filename = await joinPath(test.dirname, test[property]);
    return readFile(filename);
  };
}

function createTestOptions(opts) {
  return function(test) {
    const options = {
      documentLoader: createDocumentLoader(test)
    };
    const httpOptions = ['contentType', 'httpLink', 'httpStatus', 'redirectTo'];
    const testOptions = test.option || {};
    for(const key in testOptions) {
      if(httpOptions.indexOf(key) === -1) {
        options[key] = testOptions[key];
      }
    }
    if(opts) {
      // extend options
      for(const key in opts) {
        options[key] = opts[key];
      }
    }
    return options;
  };
}

// find the expected output property or throw error
function _getExpectProperty(test) {
  if('expect' in test) {
    return 'expect';
  } else if('result' in test) {
    return 'result';
  } else {
    throw Error('No expected output property found');
  }
}

async function compareExpectedJson(test, result) {
  let expect;
  try {
    expect = await readTestJson(_getExpectProperty(test))(test);
    assert.deepStrictEqual(result, expect);
  } catch(err) {
    if(options.bailOnError) {
      console.log('\nTEST FAILED\n');
      console.log('EXPECTED: ' + JSON.stringify(expect, null, 2));
      console.log('ACTUAL: ' + JSON.stringify(result, null, 2));
    }
    throw err;
  }
}

async function compareExpectedNQuads(test, result) {
  let expect;
  try {
    expect = await readTestNQuads(_getExpectProperty(test))(test);
    assert.strictEqual(result, expect);
  } catch(ex) {
    if(options.bailOnError) {
      console.log('\nTEST FAILED\n');
      console.log('EXPECTED:\n' + expect);
      console.log('ACTUAL:\n' + result);
    }
    throw ex;
  }
}

async function compareCanonizedExpectedNQuads(test, result) {
  let expect;
  try {
    expect = await readTestNQuads(_getExpectProperty(test))(test);
    const opts = {algorithm: 'URDNA2015'};
    const expectDataset = rdfCanonize.NQuads.parse(expect);
    const expectCmp = await rdfCanonize.canonize(expectDataset, opts);
    const resultDataset = rdfCanonize.NQuads.parse(result);
    const resultCmp = await rdfCanonize.canonize(resultDataset, opts);
    assert.strictEqual(resultCmp, expectCmp);
  } catch(err) {
    if(options.bailOnError) {
      console.log('\nTEST FAILED\n');
      console.log('EXPECTED:\n' + expect);
      console.log('ACTUAL:\n' + result);
    }
    throw err;
  }
}

async function compareExpectedError(test, err) {
  let expect;
  let result;
  try {
    expect = test[_getExpectProperty(test)];
    result = getJsonLdErrorCode(err);
    assert.ok(err, 'no error present');
    assert.strictEqual(result, expect);
  } catch(err) {
    if(options.bailOnError) {
      console.log('\nTEST FAILED\n');
      console.log('EXPECTED: ' + expect);
      console.log('ACTUAL: ' + result);
    }
    throw err;
  }
}

function isJsonLdType(node, type) {
  const nodeType = [].concat(
    getJsonLdValues(node, '@type'),
    getJsonLdValues(node, 'type')
  );
  type = Array.isArray(type) ? type : [type];
  for(let i = 0; i < type.length; ++i) {
    if(nodeType.indexOf(type[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function getJsonLdValues(node, property) {
  let rval = [];
  if(property in node) {
    rval = node[property];
    if(!Array.isArray(rval)) {
      rval = [rval];
    }
  }
  return rval;
}

function getJsonLdErrorCode(err) {
  if(!err) {
    return null;
  }
  if(err.details) {
    if(err.details.code) {
      return err.details.code;
    }
    if(err.details.cause) {
      return getJsonLdErrorCode(err.details.cause);
    }
  }
  return err.name;
}

async function readJson(filename) {
  const data = await readFile(filename);
  return JSON.parse(data);
}

async function readFile(filename) {
  return options.readFile(filename);
}

async function joinPath() {
  return join.apply(null, Array.prototype.slice.call(arguments));
}

function dirname(filename) {
  if(options.nodejs) {
    return options.nodejs.path.dirname(filename);
  }
  const idx = filename.lastIndexOf('/');
  if(idx === -1) {
    return filename;
  }
  return filename.substr(0, idx);
}

function basename(filename) {
  if(options.nodejs) {
    return options.nodejs.path.basename(filename);
  }
  const idx = filename.lastIndexOf('/');
  if(idx === -1) {
    return filename;
  }
  return filename.substr(idx + 1);
}

/**
 * Creates a test remote document loader.
 *
 * @param test the test to use the document loader for.
 *
 * @return the document loader.
 */
function createDocumentLoader(test) {
  const localBases = [
    'http://json-ld.org/test-suite',
    'https://json-ld.org/test-suite',
    'https://w3c.github.io/json-ld-api/tests',
    'https://w3c.github.io/json-ld-framing/tests'
  ];
  const localLoader = function(url, callback) {
    // always load remote-doc tests remotely in node
    if(options.nodejs && test.manifest.name === 'Remote document') {
      return jsonld.loadDocument(url, callback);
    }

    // FIXME: this check only works for main test suite and will not work if:
    // - running other tests and main test suite not installed
    // - use other absolute URIs but want to load local files
    const isTestSuite = localBases.some(function(base) {
      return url.startsWith(base);
    });
    // TODO: improve this check
    const isRelative = url.indexOf(':') === -1;
    if(isTestSuite || isRelative) {
      // attempt to load official test-suite files or relative URLs locally
      loadLocally(url).then(callback.bind(null, null), callback);
      // don't return the promise
      return;
    }

    // load remotely
    return jsonld.loadDocument(url, callback);
  };

  return localLoader;

  function loadLocally(url) {
    const doc = {contextUrl: null, documentUrl: url, document: null};
    const options = test.option;
    if(options && url === test.base) {
      if('redirectTo' in options && parseInt(options.httpStatus, 10) >= 300) {
        doc.documentUrl = test.manifest.baseIri + options.redirectTo;
      } else if('httpLink' in options) {
        let contentType = options.contentType || null;
        if(!contentType && url.indexOf('.jsonld', url.length - 7) !== -1) {
          contentType = 'application/ld+json';
        }
        let linkHeader = options.httpLink;
        if(Array.isArray(linkHeader)) {
          linkHeader = linkHeader.join(',');
        }
        linkHeader = jsonld.parseLinkHeader(
          linkHeader)['http://www.w3.org/ns/json-ld#context'];
        if(linkHeader && contentType !== 'application/ld+json') {
          if(Array.isArray(linkHeader)) {
            throw {name: 'multiple context link headers'};
          }
          doc.contextUrl = linkHeader.target;
        }
      }
    }

    let p = Promise.resolve();
    if(doc.documentUrl.indexOf(':') === -1) {
      p = p.then(() => {
        return joinPath(test.manifest.dirname, doc.documentUrl);
      }).then(filename => {
        doc.documentUrl = 'file://' + filename;
        return filename;
      });
    } else {
      p = p.then(() => {
        return joinPath(
          test.manifest.dirname,
          doc.documentUrl.substr(test.manifest.baseIri.length));
      }).then(fn => {
        return fn;
      });
    }

    return p.then(readJson).then(json => {
      doc.document = json;
      return doc;
    }).catch(() => {
      throw {name: 'loading document failed', url};
    });
  }
}

};

'use strict';



var conn = require('../lib/util/db');

conn.query(
    "SELECT CM_cortexPendingDependencies.PackageAffected, CM_cortexPendingDependencies.VersionAffected, CM_cortexDependencies.Dependencies FROM CM_cortexPendingDependencies INNER JOIN CM_cortexDependencies {{on on}} {{where where}}", {
        on: {
            'CM_cortexPendingDependencies.PackageAffected': 'CM_cortexDependencies.Package',
            'CM_cortexPendingDependencies.VersionAffected': 'CM_cortexDependencies.Version'
        },

        where: {
            'CM_cortexPendingDependencies.Package': 'b',
            'CM_cortexPendingDependencies.Version': '0.0.1'
        }
    },
    function(err, result) {
        console.log(err, result);
    }
);

// function a(a, b, c) {
//     a = 1;
//     b = 2;
//     c = 3;

//     arguments[1] = 1;

//     console.log(arguments);  
// };

// a(0, 0, 0)
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('notes', {
        owner: {
            type: 'VARCHAR(50)'
        },
    });
};

exports.down = pgm => {
    pgm.dropColumn('notes', 'owner');
};

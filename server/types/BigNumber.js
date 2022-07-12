const bignum = require('bignumber.js');
const { GraphQLScalarType } = require('graphql');

const BigNumber = new GraphQLScalarType({
  name: 'BigNumber',
  description:
    "Large numbers that cannot be represented by JavaScript's Int type",
  // value from the client
  serialize(value) {
    const int64 = new bignum(value).toFixed();
    // Implement your own behavior here by setting the 'result' variable
    return int64;
  },
  // value sent to the client
  parseValue(value) {
    return value;
  },
  // ast value is always in string format
  parseLiteral(ast) {
    switch (ast.kind) {
      case 'IntValue':
        return ast.value;
      // Implement your own behavior here by returning what suits your needs
      // depending on ast.kind
    }
  }
});

module.exports = {
  BigNumber
}
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var assert = require('assert');
var BN = require('bn.js');
var BufferLayout = require('buffer-layout');
var web3_js = require('@solana/web3.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var BN__default = /*#__PURE__*/_interopDefaultLegacy(BN);

/**
 * Layout for a public key
 */

const publicKey = (property = 'publicKey') => {
  return BufferLayout.blob(32, property);
};
/**
 * Layout for a 64bit unsigned value
 */

const uint64 = (property = 'uint64') => {
  return BufferLayout.blob(8, property);
};

function sendAndConfirmTransaction(title, connection, transaction, ...signers) {
  return web3_js.sendAndConfirmTransaction(connection, transaction, signers, {
    skipPreflight: false,
    commitment: 'recent',
    preflightCommitment: 'recent'
  });
}

async function loadAccount(connection, address, programId) {
  const accountInfo = await connection.getAccountInfo(address);

  if (accountInfo === null) {
    throw new Error('Failed to find account');
  }

  if (!accountInfo.owner.equals(programId)) {
    throw new Error(`Invalid owner: ${JSON.stringify(accountInfo.owner)}`);
  }

  return Buffer.from(accountInfo.data);
}

/**
 * Some amount of tokens
 */

class Numberu64 extends BN__default['default'] {
  /**
   * Convert to Buffer representation
   */
  toBuffer() {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);

    if (b.length === 8) {
      return b;
    }

    assert__default['default'](b.length < 8, 'Numberu64 too large');
    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }
  /**
   * Construct a Numberu64 from Buffer representation
   */


  static fromBuffer(buffer) {
    assert__default['default'](buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
    return new Numberu64([...buffer].reverse().map(i => `00${i.toString(16)}`.slice(-2)).join(''), 16);
  }

}
/**
 * @private
 */

const TokenSwapLayout = BufferLayout.struct([BufferLayout.u8('isInitialized'), BufferLayout.u8('nonce'), publicKey('tokenProgramId'), publicKey('tokenAccountA'), publicKey('tokenAccountB'), publicKey('tokenPool'), publicKey('mintA'), publicKey('mintB'), publicKey('feeAccount'), uint64('tradeFeeNumerator'), uint64('tradeFeeDenominator'), uint64('ownerTradeFeeNumerator'), uint64('ownerTradeFeeDenominator'), uint64('ownerWithdrawFeeNumerator'), uint64('ownerWithdrawFeeDenominator'), uint64('hostFeeNumerator'), uint64('hostFeeDenominator'), BufferLayout.u8('curveType'), BufferLayout.blob(32, 'curveParameters')]);
const CurveType = Object.freeze({
  ConstantProduct: 0,
  // Constant product curve, Uniswap-style
  ConstantPrice: 1,
  // Constant price curve, always X amount of A token for 1 B token, where X is defined at init
  Stable: 2,
  Offset: 3 // Offset curve, like Uniswap, but with an additional offset on the token B side

});
/**
 * A program to exchange tokens against a pool of liquidity
 */

class TokenSwap {
  /**
   * @private
   */

  /**
   * Program Identifier for the Swap program
   */

  /**
   * Program Identifier for the Token program
   */

  /**
   * The public key identifying this swap program
   */

  /**
   * The public key for the liquidity pool token mint
   */

  /**
   * The public key for the fee account receiving trade and/or withdrawal fees
   */

  /**
   * Authority
   */

  /**
   * The public key for the first token account of the trading pair
   */

  /**
   * The public key for the second token account of the trading pair
   */

  /**
   * The public key for the mint of the first token account of the trading pair
   */

  /**
   * The public key for the mint of the second token account of the trading pair
   */

  /**
   * Trading fee numerator
   */

  /**
   * Trading fee denominator
   */

  /**
   * Owner trading fee numerator
   */

  /**
   * Owner trading fee denominator
   */

  /**
   * Owner withdraw fee numerator
   */

  /**
   * Owner withdraw fee denominator
   */

  /**
   * Host trading fee numerator
   */

  /**
   * Host trading fee denominator
   */

  /**
   * CurveType, current options are:
   */

  /**
   * Fee payer
   */

  /**
   * Create a Token object attached to the specific token
   *
   * @param connection The connection to use
   * @param tokenSwap The token swap account
   * @param swapProgramId The program ID of the token-swap program
   * @param tokenProgramId The program ID of the token program
   * @param poolToken The pool token
   * @param authority The authority over the swap and accounts
   * @param tokenAccountA: The token swap's Token A account
   * @param tokenAccountB: The token swap's Token B account
   * @param payer Pays for the transaction
   */
  constructor(connection, tokenSwap, swapProgramId, tokenProgramId, poolToken, feeAccount, authority, tokenAccountA, tokenAccountB, mintA, mintB, tradeFeeNumerator, tradeFeeDenominator, ownerTradeFeeNumerator, ownerTradeFeeDenominator, ownerWithdrawFeeNumerator, ownerWithdrawFeeDenominator, hostFeeNumerator, hostFeeDenominator, curveType, payer) {
    _defineProperty__default['default'](this, "connection", void 0);

    _defineProperty__default['default'](this, "swapProgramId", void 0);

    _defineProperty__default['default'](this, "tokenProgramId", void 0);

    _defineProperty__default['default'](this, "tokenSwap", void 0);

    _defineProperty__default['default'](this, "poolToken", void 0);

    _defineProperty__default['default'](this, "feeAccount", void 0);

    _defineProperty__default['default'](this, "authority", void 0);

    _defineProperty__default['default'](this, "tokenAccountA", void 0);

    _defineProperty__default['default'](this, "tokenAccountB", void 0);

    _defineProperty__default['default'](this, "mintA", void 0);

    _defineProperty__default['default'](this, "mintB", void 0);

    _defineProperty__default['default'](this, "tradeFeeNumerator", void 0);

    _defineProperty__default['default'](this, "tradeFeeDenominator", void 0);

    _defineProperty__default['default'](this, "ownerTradeFeeNumerator", void 0);

    _defineProperty__default['default'](this, "ownerTradeFeeDenominator", void 0);

    _defineProperty__default['default'](this, "ownerWithdrawFeeNumerator", void 0);

    _defineProperty__default['default'](this, "ownerWithdrawFeeDenominator", void 0);

    _defineProperty__default['default'](this, "hostFeeNumerator", void 0);

    _defineProperty__default['default'](this, "hostFeeDenominator", void 0);

    _defineProperty__default['default'](this, "curveType", void 0);

    _defineProperty__default['default'](this, "payer", void 0);

    Object.assign(this, {
      connection,
      tokenSwap,
      swapProgramId,
      tokenProgramId,
      poolToken,
      feeAccount,
      authority,
      tokenAccountA,
      tokenAccountB,
      mintA,
      mintB,
      tradeFeeNumerator,
      tradeFeeDenominator,
      ownerTradeFeeNumerator,
      ownerTradeFeeDenominator,
      ownerWithdrawFeeNumerator,
      ownerWithdrawFeeDenominator,
      hostFeeNumerator,
      hostFeeDenominator,
      curveType,
      payer
    });
  }
  /**
   * Get the minimum balance for the token swap account to be rent exempt
   *
   * @return Number of lamports required
   */


  static async getMinBalanceRentForExemptTokenSwap(connection) {
    return await connection.getMinimumBalanceForRentExemption(TokenSwapLayout.span);
  }

  static createInitSwapInstruction(tokenSwapAccount, authority, tokenAccountA, tokenAccountB, tokenPool, feeAccount, tokenAccountPool, tokenProgramId, swapProgramId, nonce, tradeFeeNumerator, tradeFeeDenominator, ownerTradeFeeNumerator, ownerTradeFeeDenominator, ownerWithdrawFeeNumerator, ownerWithdrawFeeDenominator, hostFeeNumerator, hostFeeDenominator, curveType, amp) {
    const keys = [{
      pubkey: tokenSwapAccount.publicKey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: authority,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: tokenAccountA,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: tokenAccountB,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: tokenPool,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: feeAccount,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: tokenAccountPool,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: tokenProgramId,
      isSigner: false,
      isWritable: false
    }];
    const commandDataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), BufferLayout.u8('nonce'), BufferLayout.nu64('tradeFeeNumerator'), BufferLayout.nu64('tradeFeeDenominator'), BufferLayout.nu64('ownerTradeFeeNumerator'), BufferLayout.nu64('ownerTradeFeeDenominator'), BufferLayout.nu64('ownerWithdrawFeeNumerator'), BufferLayout.nu64('ownerWithdrawFeeDenominator'), BufferLayout.nu64('hostFeeNumerator'), BufferLayout.nu64('hostFeeDenominator'), BufferLayout.u8('curveType'), BufferLayout.nu64('amp'), BufferLayout.blob(24, 'curveParameters')]);
    let data = Buffer.alloc(1024);
    {
      const encodeLength = commandDataLayout.encode({
        instruction: 0,
        // InitializeSwap instruction
        nonce,
        tradeFeeNumerator,
        tradeFeeDenominator,
        ownerTradeFeeNumerator,
        ownerTradeFeeDenominator,
        ownerWithdrawFeeNumerator,
        ownerWithdrawFeeDenominator,
        hostFeeNumerator,
        hostFeeDenominator,
        curveType,
        amp
      }, data);
      data = data.slice(0, encodeLength);
    }
    return new web3_js.TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    });
  }

  static async loadTokenSwap(connection, address, programId, payer) {
    const data = await loadAccount(connection, address, programId);
    const tokenSwapData = TokenSwapLayout.decode(data);

    if (!tokenSwapData.isInitialized) {
      throw new Error(`Invalid token swap state`);
    }

    const [authority] = await web3_js.PublicKey.findProgramAddress([address.toBuffer()], programId);
    const poolToken = new web3_js.PublicKey(tokenSwapData.tokenPool);
    const feeAccount = new web3_js.PublicKey(tokenSwapData.feeAccount);
    const tokenAccountA = new web3_js.PublicKey(tokenSwapData.tokenAccountA);
    const tokenAccountB = new web3_js.PublicKey(tokenSwapData.tokenAccountB);
    const mintA = new web3_js.PublicKey(tokenSwapData.mintA);
    const mintB = new web3_js.PublicKey(tokenSwapData.mintB);
    const tokenProgramId = new web3_js.PublicKey(tokenSwapData.tokenProgramId);
    const tradeFeeNumerator = Numberu64.fromBuffer(tokenSwapData.tradeFeeNumerator);
    const tradeFeeDenominator = Numberu64.fromBuffer(tokenSwapData.tradeFeeDenominator);
    const ownerTradeFeeNumerator = Numberu64.fromBuffer(tokenSwapData.ownerTradeFeeNumerator);
    const ownerTradeFeeDenominator = Numberu64.fromBuffer(tokenSwapData.ownerTradeFeeDenominator);
    const ownerWithdrawFeeNumerator = Numberu64.fromBuffer(tokenSwapData.ownerWithdrawFeeNumerator);
    const ownerWithdrawFeeDenominator = Numberu64.fromBuffer(tokenSwapData.ownerWithdrawFeeDenominator);
    const hostFeeNumerator = Numberu64.fromBuffer(tokenSwapData.hostFeeNumerator);
    const hostFeeDenominator = Numberu64.fromBuffer(tokenSwapData.hostFeeDenominator);
    const curveType = tokenSwapData.curveType;
    return new TokenSwap(connection, address, programId, tokenProgramId, poolToken, feeAccount, authority, tokenAccountA, tokenAccountB, mintA, mintB, tradeFeeNumerator, tradeFeeDenominator, ownerTradeFeeNumerator, ownerTradeFeeDenominator, ownerWithdrawFeeNumerator, ownerWithdrawFeeDenominator, hostFeeNumerator, hostFeeDenominator, curveType, payer);
  }
  /**
   * Create a new Token Swap
   *
   * @param connection The connection to use
   * @param payer Pays for the transaction
   * @param tokenSwapAccount The token swap account
   * @param authority The authority over the swap and accounts
   * @param nonce The nonce used to generate the authority
   * @param tokenAccountA: The token swap's Token A account
   * @param tokenAccountB: The token swap's Token B account
   * @param poolToken The pool token
   * @param tokenAccountPool The token swap's pool token account
   * @param tokenProgramId The program ID of the token program
   * @param swapProgramId The program ID of the token-swap program
   * @param feeNumerator Numerator of the fee ratio
   * @param feeDenominator Denominator of the fee ratio
   * @return Token object for the newly minted token, Public key of the account holding the total supply of new tokens
   */


  static async createTokenSwap(connection, payer, tokenSwapAccount, authority, tokenAccountA, tokenAccountB, poolToken, mintA, mintB, feeAccount, tokenAccountPool, swapProgramId, tokenProgramId, nonce, tradeFeeNumerator, tradeFeeDenominator, ownerTradeFeeNumerator, ownerTradeFeeDenominator, ownerWithdrawFeeNumerator, ownerWithdrawFeeDenominator, hostFeeNumerator, hostFeeDenominator, curveType) {
    let transaction;
    const tokenSwap = new TokenSwap(connection, tokenSwapAccount.publicKey, swapProgramId, tokenProgramId, poolToken, feeAccount, authority, tokenAccountA, tokenAccountB, mintA, mintB, new Numberu64(tradeFeeNumerator), new Numberu64(tradeFeeDenominator), new Numberu64(ownerTradeFeeNumerator), new Numberu64(ownerTradeFeeDenominator), new Numberu64(ownerWithdrawFeeNumerator), new Numberu64(ownerWithdrawFeeDenominator), new Numberu64(hostFeeNumerator), new Numberu64(hostFeeDenominator), curveType, payer); // Allocate memory for the account

    const balanceNeeded = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection);
    transaction = new web3_js.Transaction();
    transaction.add(web3_js.SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: tokenSwapAccount.publicKey,
      lamports: balanceNeeded,
      space: TokenSwapLayout.span,
      programId: swapProgramId
    }));
    const instruction = TokenSwap.createInitSwapInstruction(tokenSwapAccount, authority, tokenAccountA, tokenAccountB, poolToken, feeAccount, tokenAccountPool, tokenProgramId, swapProgramId, nonce, tradeFeeNumerator, tradeFeeDenominator, ownerTradeFeeNumerator, ownerTradeFeeDenominator, ownerWithdrawFeeNumerator, ownerWithdrawFeeDenominator, hostFeeNumerator, hostFeeDenominator, curveType);
    transaction.add(instruction);
    await sendAndConfirmTransaction('createAccount and InitializeSwap', connection, transaction, payer, tokenSwapAccount);
    return tokenSwap;
  }
  /**
   * Swap token A for token B
   *
   * @param userSource User's source token account
   * @param poolSource Pool's source token account
   * @param poolDestination Pool's destination token account
   * @param userDestination User's destination token account
   * @param amountIn Amount to transfer from source account
   * @param minimumAmountOut Minimum amount of tokens the user will receive
   */


  async swap(userSource, poolSource, poolDestination, userDestination, hostFeeAccount, amountIn, minimumAmountOut) {
    return await sendAndConfirmTransaction('swap', this.connection, new web3_js.Transaction().add(TokenSwap.swapInstruction(this.tokenSwap, this.authority, userSource, poolSource, poolDestination, userDestination, this.poolToken, this.feeAccount, hostFeeAccount, this.swapProgramId, this.tokenProgramId, amountIn, minimumAmountOut)), this.payer);
  }

  static swapInstruction(tokenSwap, authority, userSource, poolSource, poolDestination, userDestination, poolMint, feeAccount, hostFeeAccount, swapProgramId, tokenProgramId, amountIn, minimumAmountOut) {
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), uint64('amountIn'), uint64('minimumAmountOut')]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 1,
      // Swap instruction
      amountIn: new Numberu64(amountIn).toBuffer(),
      minimumAmountOut: new Numberu64(minimumAmountOut).toBuffer()
    }, data);
    const keys = [{
      pubkey: tokenSwap,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: authority,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: userSource,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: poolSource,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: poolDestination,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: userDestination,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: poolMint,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: feeAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: tokenProgramId,
      isSigner: false,
      isWritable: false
    }];

    if (hostFeeAccount != null) {
      keys.push({
        pubkey: hostFeeAccount,
        isSigner: false,
        isWritable: true
      });
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    });
  }
  /**
   * Deposit tokens into the pool
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param poolTokenAmount Amount of pool tokens to mint
   * @param maximumTokenA The maximum amount of token A to deposit
   * @param maximumTokenB The maximum amount of token B to deposit
   */


  async depositAllTokenTypes(userAccountA, userAccountB, poolAccount, poolTokenAmount, maximumTokenA, maximumTokenB) {
    return await sendAndConfirmTransaction('depositAllTokenTypes', this.connection, new web3_js.Transaction().add(TokenSwap.depositAllTokenTypesInstruction(this.tokenSwap, this.authority, userAccountA, userAccountB, this.tokenAccountA, this.tokenAccountB, this.poolToken, poolAccount, this.swapProgramId, this.tokenProgramId, poolTokenAmount, maximumTokenA, maximumTokenB)), this.payer);
  }

  static depositAllTokenTypesInstruction(tokenSwap, authority, sourceA, sourceB, intoA, intoB, poolToken, poolAccount, swapProgramId, tokenProgramId, poolTokenAmount, maximumTokenA, maximumTokenB) {
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), uint64('poolTokenAmount'), uint64('maximumTokenA'), uint64('maximumTokenB')]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 2,
      // Deposit instruction
      poolTokenAmount: new Numberu64(poolTokenAmount).toBuffer(),
      maximumTokenA: new Numberu64(maximumTokenA).toBuffer(),
      maximumTokenB: new Numberu64(maximumTokenB).toBuffer()
    }, data);
    const keys = [{
      pubkey: tokenSwap,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: authority,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: sourceA,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: sourceB,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: intoA,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: intoB,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: poolToken,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: poolAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: tokenProgramId,
      isSigner: false,
      isWritable: false
    }];
    return new web3_js.TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    });
  }
  /**
   * Withdraw tokens from the pool
   *
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param poolTokenAmount Amount of pool tokens to burn
   * @param minimumTokenA The minimum amount of token A to withdraw
   * @param minimumTokenB The minimum amount of token B to withdraw
   */


  async withdrawAllTokenTypes(userAccountA, userAccountB, poolAccount, poolTokenAmount, minimumTokenA, minimumTokenB) {
    return await sendAndConfirmTransaction('withdraw', this.connection, new web3_js.Transaction().add(TokenSwap.withdrawAllTokenTypesInstruction(this.tokenSwap, this.authority, this.poolToken, this.feeAccount, poolAccount, this.tokenAccountA, this.tokenAccountB, userAccountA, userAccountB, this.swapProgramId, this.tokenProgramId, poolTokenAmount, minimumTokenA, minimumTokenB)), this.payer);
  }

  static withdrawAllTokenTypesInstruction(tokenSwap, authority, poolMint, feeAccount, sourcePoolAccount, fromA, fromB, userAccountA, userAccountB, swapProgramId, tokenProgramId, poolTokenAmount, minimumTokenA, minimumTokenB) {
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), uint64('poolTokenAmount'), uint64('minimumTokenA'), uint64('minimumTokenB')]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 3,
      // Withdraw instruction
      poolTokenAmount: new Numberu64(poolTokenAmount).toBuffer(),
      minimumTokenA: new Numberu64(minimumTokenA).toBuffer(),
      minimumTokenB: new Numberu64(minimumTokenB).toBuffer()
    }, data);
    const keys = [{
      pubkey: tokenSwap,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: authority,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: poolMint,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: sourcePoolAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: fromA,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: fromB,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: userAccountA,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: userAccountB,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: feeAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: tokenProgramId,
      isSigner: false,
      isWritable: false
    }];
    return new web3_js.TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    });
  }
  /**
   * Deposit one side of tokens into the pool
   * @param userAccount User account to deposit token A or B
   * @param poolAccount User account to receive pool tokens
   * @param sourceTokenAmount The amount of token A or B to deposit
   * @param minimumPoolTokenAmount Minimum amount of pool tokens to mint
   */


  async depositSingleTokenTypeExactAmountIn(userAccount, poolAccount, sourceTokenAmount, minimumPoolTokenAmount) {
    return await sendAndConfirmTransaction('depositSingleTokenTypeExactAmountIn', this.connection, new web3_js.Transaction().add(TokenSwap.depositSingleTokenTypeExactAmountInInstruction(this.tokenSwap, this.authority, userAccount, this.tokenAccountA, this.tokenAccountB, this.poolToken, poolAccount, this.swapProgramId, this.tokenProgramId, sourceTokenAmount, minimumPoolTokenAmount)), this.payer);
  }

  static depositSingleTokenTypeExactAmountInInstruction(tokenSwap, authority, source, intoA, intoB, poolToken, poolAccount, swapProgramId, tokenProgramId, sourceTokenAmount, minimumPoolTokenAmount) {
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), uint64('sourceTokenAmount'), uint64('minimumPoolTokenAmount')]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 4,
      // depositSingleTokenTypeExactAmountIn instruction
      sourceTokenAmount: new Numberu64(sourceTokenAmount).toBuffer(),
      minimumPoolTokenAmount: new Numberu64(minimumPoolTokenAmount).toBuffer()
    }, data);
    const keys = [{
      pubkey: tokenSwap,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: authority,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: source,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: intoA,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: intoB,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: poolToken,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: poolAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: tokenProgramId,
      isSigner: false,
      isWritable: false
    }];
    return new web3_js.TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    });
  }
  /**
   * Withdraw tokens from the pool
   *
   * @param userAccount User account to receive token A or B
   * @param poolAccount User account to burn pool token
   * @param destinationTokenAmount The amount of token A or B to withdraw
   * @param maximumPoolTokenAmount Maximum amount of pool tokens to burn
   */


  async withdrawSingleTokenTypeExactAmountOut(userAccount, poolAccount, destinationTokenAmount, maximumPoolTokenAmount) {
    return await sendAndConfirmTransaction('withdrawSingleTokenTypeExactAmountOut', this.connection, new web3_js.Transaction().add(TokenSwap.withdrawSingleTokenTypeExactAmountOutInstruction(this.tokenSwap, this.authority, this.poolToken, this.feeAccount, poolAccount, this.tokenAccountA, this.tokenAccountB, userAccount, this.swapProgramId, this.tokenProgramId, destinationTokenAmount, maximumPoolTokenAmount)), this.payer);
  }

  static withdrawSingleTokenTypeExactAmountOutInstruction(tokenSwap, authority, poolMint, feeAccount, sourcePoolAccount, fromA, fromB, userAccount, swapProgramId, tokenProgramId, destinationTokenAmount, maximumPoolTokenAmount) {
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), uint64('destinationTokenAmount'), uint64('maximumPoolTokenAmount')]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 5,
      // withdrawSingleTokenTypeExactAmountOut instruction
      destinationTokenAmount: new Numberu64(destinationTokenAmount).toBuffer(),
      maximumPoolTokenAmount: new Numberu64(maximumPoolTokenAmount).toBuffer()
    }, data);
    const keys = [{
      pubkey: tokenSwap,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: authority,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: poolMint,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: sourcePoolAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: fromA,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: fromB,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: userAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: feeAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: tokenProgramId,
      isSigner: false,
      isWritable: false
    }];
    return new web3_js.TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    });
  }

}

exports.CurveType = CurveType;
exports.Numberu64 = Numberu64;
exports.TokenSwap = TokenSwap;
exports.TokenSwapLayout = TokenSwapLayout;
//# sourceMappingURL=index.cjs.js.map

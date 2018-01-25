const StellarSdk = require('stellar-sdk');

// source keypair loaded with internet money
const kp = StellarSdk.Keypair.fromSecret('SC6NXDTS3IUP6WQLWS3YSXFEF6QT2FZJPIU6CQXNRBLILD6GWVFZGBJO');
console.info('Source Secret Key:', kp.secret());
console.info('Source Public Key:', kp.publicKey());

// destination keypair loaded with internet money
const dkp = StellarSdk.Keypair.fromSecret('SCYRTCA6Q4CC2PK7AN3EH3MCSX4IRX43KU4VNSRHTUCJZWBEW7A3LR5T');
console.info('Destination Secret Key:', dkp.secret());
console.info('Destination Public Key:', dkp.publicKey());

// connect to the testnet
StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

server.loadAccount(kp.publicKey()).then((account) => {
  console.info('Source Balances');
  account.balances.forEach((balance) => {
    console.info('• Type:', balance.asset_type, 'Balance:', balance.balance);
  });

  const txn = new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.payment({
      destination: dkp.publicKey(),
      asset: StellarSdk.Asset.native(),
      amount: '10',
    }))
    .addMemo(StellarSdk.Memo.text('Hey there buddy. 🚀'))
    .build();

  txn.sign(kp);

  console.info('Signed Txn:', txn.hash());

  server.submitTransaction(txn).then(result => {
    console.info('Sent:', result);
  }).catch(error => {
    console.error('Failed!', error);
  });
});

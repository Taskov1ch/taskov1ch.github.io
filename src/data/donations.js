const donationsData = [
  {
    id: 'bmc',
    title: 'Buy Me a Coffee',
    description: 'Самый простой способ поддержать меня',
    value: 'https://www.buymeacoffee.com/your_user', // <-- Замените
    type: 'link',
    icon: '/icons/buymeacoffee.svg',
  },
  {
    id: 'btc',
    title: 'Bitcoin (BTC)',
    description: 'Сеть Bitcoin (BTC)', // <-- Изменено
    value: 'bc1qYourBitcoinAddressHereLongString123', // <-- Замените
    type: 'copy',
    icon: '/icons/btc.svg',
  },
  {
    id: 'eth',
    title: 'Ethereum (ETH)',
    description: 'Сеть Ethereum (ERC-20)', // <-- Изменено
    value: '0xYourEthereumAddressHereLongString456', // <-- Замените
    type: 'copy',
    icon: '/icons/eth.svg',
  },
    {
    id: 'usdt',
    title: 'USDT',
    description: 'Сеть TRON (TRC-20)', // <-- Изменено
    value: 'TYourTronAddressHereLongString789', // <-- Замените
    type: 'copy',
    icon: '/icons/usdt.svg',
  },
];

export default donationsData;
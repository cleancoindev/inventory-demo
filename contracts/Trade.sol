pragma solidity ^0.4.23;

import "contracts/Goods.sol";


contract Trade {

    event GoodAdded(address _trader, uint256 goodID);

    address[] public traders;
    mapping(address=>bool) public isTrader;

    Goods goods;

    mapping(address => uint256[]) public traderGoods;
    mapping(uint256 => uint256) public traderGoodsIndex;
    uint256 public numGoods = 0;

    constructor(Goods _goods, address[] _traders) public {
        goods = _goods;
        traders = _traders;
        for (uint256 index = 0; index < traders.length; index++) {
            isTrader[traders[index]] = true;
        }
    }

    modifier onlyTrader(address trader) {
        require(isTrader[trader]);
        _;
    }

    function numTraders() public view returns (uint256) {
        return traders.length;
    }

    function addGood(uint256 goodID) onlyTrader(msg.sender) public {
        require(goods.ownerOf(goodID) == msg.sender);

        traderGoodsIndex[goodID] = traderGoods[msg.sender].length;
        traderGoods[msg.sender].push(goodID);
        numGoods++;

        emit GoodAdded(msg.sender, goodID);
    }

    function removeGood(uint256 goodID) onlyTrader(msg.sender) public {
        require(goods.ownerOf(goodID) == msg.sender);
        uint index = traderGoodsIndex[goodID];

        for (uint i = index; i < traderGoods[msg.sender].length - 1; i++){
            traderGoods[msg.sender][i] = traderGoods[msg.sender][i + 1];
        }
        traderGoods[msg.sender].length--;
        numGoods--;
    }

    function numTraderGoods(address trader)
    onlyTrader(trader) public view returns (uint256) {
        return traderGoods[trader].length;
    }

    function traderGoodByIndex(address trader, uint256 index)
    onlyTrader(trader) public view returns (uint256) {
        return traderGoods[trader][index];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ClonesWithImmutableArgs} from "clones-with-immutable-args/ClonesWithImmutableArgs.sol";
import {Auth, Authority} from "@rari-capital/solmate/src/auth/Auth.sol";

import {HolderSale} from "./Sale.sol";

contract HolderFactory is Auth {
    event CreateSale(HolderSale indexed sale);

    using ClonesWithImmutableArgs for address;

    HolderSale public immutable saleImplementation;

    constructor(HolderSale _saleImplementation, address _owner)
        Auth(_owner, Authority(address(0)))
    {
        saleImplementation = _saleImplementation;
    }

    function deploy(
        address lab,
        uint96 wallet,
        address receiver,
        uint96 transaction,
        address token,
        uint96 finish,
        address checker,
        uint96 start,
        uint128 supply,
        uint128 cost,
        uint256 item,
        address _owner
    ) external requiresAuth returns (HolderSale sale) {
        bytes memory data = abi.encodePacked(
            lab,
            wallet,
            receiver,
            transaction,
            token,
            finish,
            checker,
            start,
            supply,
            cost,
            item
        );

        sale = HolderSale(address(saleImplementation).clone(data));
        sale.initialize(_owner);

        emit CreateSale(sale);
    }
}

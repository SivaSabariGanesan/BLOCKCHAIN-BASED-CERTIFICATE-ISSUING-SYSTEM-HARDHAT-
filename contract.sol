// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CertificateIssuer is ERC721 {
    uint256 public tokenCounter;

    struct Certificate {
        string ipfsHash;
        address issuedTo;
    }

    mapping(uint256 => Certificate) public certificates;

    constructor() ERC721("Certificate", "CERT") {
        tokenCounter = 0;
    }

    function issueCertificate(string memory _ipfsHash, address _to) public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        certificates[newTokenId] = Certificate(_ipfsHash, _to);
        _safeMint(_to, newTokenId);
        tokenCounter += 1;
        return newTokenId;
    }

    function getCertificate(uint256 tokenId) public view returns (Certificate memory) {
        return certificates[tokenId];
    }
}

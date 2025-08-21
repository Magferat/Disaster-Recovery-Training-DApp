const UserManagement = artifacts.require("UserManagement");
module.exports = async function (deployer) {
    await deployer.deploy(UserManagement);
};

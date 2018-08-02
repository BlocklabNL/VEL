module.exports = (sequelize, DataTypes) => {
    var User =  sequelize.define('users', {
        first_name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        zip_code: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        }
    })
    return User;
}

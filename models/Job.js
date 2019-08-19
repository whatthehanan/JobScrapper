
module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define(
        "jobs",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            company_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            position: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            time_posted: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            full_description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        },
        {
            tableName: "jobs",
            createdAt: "created_at",
            updatedAt: "updated_at",
            paranoid: false,
            timestamps: true
        }
    );

    Job.associate = models => {
        // define relationships here
    };

    return Job;
};
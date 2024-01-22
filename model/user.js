// table info

// CREATE TABLE "public"."users" (
//     "id" int4,
//     "name" varchar(255),
//     "user_name" varchar(255),
//     "email" varchar(255),
//     "subid" varchar(36),
//     "status" varchar(255),
//     "pre_signup_at" timestamptz,
//     "confirmed_at" timestamptz,
//     "last_loggin_at" timestamptz,
//     "phone_number" varchar(20),
//     "description" text,
//     "stripe_customer_ids" jsonb,
//     "created_at" timestamptz,
//     "updated_at" timestamptz,
//     "role" varchar(25),
//     "avatar_url" varchar(255),
//     "metadata" varchar,
//     "site_id" varchar(100)
// );

module.exports = (sequelize, type) => {
    return sequelize.define("users", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_name: type.STRING,
        email: type.STRING,
        site_id: type.STRING,
        createdAt: {
            type: type.DATE,
            field: "created_at",
        },
        updatedAt: {
            type: type.DATE,
            field: "updated_at",
        },
    });
};

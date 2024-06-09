DELETE FROM Record;
DELETE FROM LocationStatus;
DELETE FROM UserCampaign;
DELETE FROM Location;
DELETE FROM Campaign;
DELETE FROM User;
DELETE FROM Admin;
DELETE FROM Company;

INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(4, N'superkeno', N'superkeno', 1, NULL, N'09090', N'');

INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(35, N'vela', N'vela', 1, NULL, N'56477', N'');

INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(87, N'dzajic', N'dzajic', 1, NULL, N'11111111', N'');


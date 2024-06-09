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
VALUES(4, N'superkeno', N'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1, NULL, N'09090', N'');

INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(35, N'vela', N'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1, NULL, N'564', N'');

INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(87, N'dzajicad', N'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1, NULL, N'11111111', N'');


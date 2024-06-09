-- delete history
DELETE FROM Record;
DELETE FROM LocationStatus;
DELETE FROM UserCampaign;
DELETE FROM Location;
DELETE FROM Campaign;
DELETE FROM 'User';
DELETE FROM Admin;
DELETE FROM Company;

-- companies
--SET IDENTITY_INSERT Company ON;
INSERT INTO Company
(Id, Name)
VALUES(1, N'Kompanija 1');
INSERT INTO Company
(Id, Name)
VALUES(2, N'Kompanija 2');
INSERT INTO Company
(Id, Name)
VALUES(21, N'Komapanija 4');
INSERT INTO Company
(Id, Name)
VALUES(27, N'Kompanija 3');
INSERT INTO Company
(Id, Name)
VALUES(30, N'Kompanija 7');
INSERT INTO Company
(Id, Name)
VALUES(37, N'Kompanija 10');
INSERT INTO Company
(Id, Name)
VALUES(53, N'Kompanija 9');
INSERT INTO Company
(Id, Name)
VALUES(64, N'Sarajevo Travel');
INSERT INTO Company
(Id, Name)
VALUES(77, N'nova');
--SET IDENTITY_INSERT Company OFF;
-- admins
--SET IDENTITY_INSERT Admin ON;
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(1, N'tarik', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 0, 1, N'0622222', N'3R6BYGL6TXYLIKLOABSX');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(2, N'griza1', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 0, 2, N'124', N'PCURFGEEPLCU6VHYONV2');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(3, N'noviAdmin', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 0, 2, N'122', N'NGCD4RDEOWFM77IFDEPB');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(4, N'vela', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 1, NULL, N'09090', N'C7YJB6KU6P762RR4NU2W');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(35, N'rikta', N'454349e422f05297191ead13e21d3db520e5abef52055e4964b82fb213f593a1', 0, 1, N'564', N'OZJX7SZPBJOX3INZGCJ4');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(47, N'superadmin1', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 1, 2, N'061111111', N'DKXWB4L2L3UHZ2PMBNOS');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(53, N'V', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 1, NULL, N'09000', N'ZM72VNCQLZW5O4JTDRD7');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(64, N'bera', N'd4c11669cc2cbab33bc256c245cb9ae6e911cbf1c89ec6b20f2f68c4bcfd72cc', 0, 2, N'225456', N'B4E4WJEAE742DKLVJ7O5');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(65, N'bera1', N'd4c11669cc2cbab33bc256c245cb9ae6e911cbf1c89ec6b20f2f68c4bcfd72cc', 1, NULL, N'00', N'BZOIPXWXWBUCQCTNAIHR');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(66, N'beraaa', N'd4c11669cc2cbab33bc256c245cb9ae6e911cbf1c89ec6b20f2f68c4bcfd72cc', 1, NULL, N'00', N'PYUJFV6YA7PYXFGXGYPF');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(75, N'LastCheck', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 0, 2, N'123', N'BOYTPALWROUSDNQ3AFB3');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(83, N'proba11', N'5de9c980e6628d81f8a39ebf8fa30abf03a6de176ae51d63f051f5076b180285', 0, 1, N'123', N'QM2B3CNGRQ2HMJJKWZLH');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(84, N'kera', N'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 1, 2, N'61', N'YRX72HKVMGA4C5KCF2MK');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(85, N'proba22', N'9abac760c231a65b66a01891441144da3534e68e144d27cfc6a0ff52cccb874e', 0, 2, N'123', N'');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(86, N'keraAdmin', N'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 0, 2, N'61', N'FFXDEDAMPNMW6XVLFAU4');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(87, N'dzajicad', N'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 0, 1, N'11111111', N'QLNMW7GP3ZM6PN5LMER4');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(88, N'Admin', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 0, 2, N'12456', N'ZSRMUFPA3F5X63EOCRXC');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(91, N'test', N'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1, 2, N'61111111', N'');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(97, N'emirAdmin', N'2822303c0329d1caf97f15bb4c2f36298bc3d2fcf4550dfedbcae1e257f1aa88', 0, 1, N'1222', N'5GJNW6RZPIIBL2LYUC3P');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(98, N'emirSuper', N'e7b7a1aa7bd6661ad52ae1cdcf8bb582d235e80b40bc517eefbc61f31f38c2e2', 1, NULL, N'123', N'27VA6TO37ENI5N4L7HL5');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(99, N'testing', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 0, 37, N'11', N'3QQUHTY23S44V3XYJ5IX');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(112, N'aida', N'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 0, 1, N'1111111111111', N'FMF2DEQUZWOCGXMHE4BC');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(114, N'tarik', N'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae', 0, 2, N'111', N'AC2E3T7ATVLIXPP3R5PN');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(116, N'testAdmin', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', 0, 2, N'61111111', N'OBJJCLXDKQLXIE3ADY4G');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(118, N'gr', N'183ee0870433a102edb987ee4924a9d4f39af24db56c0e5d01bb9e8e56263439', 0, 1, N'22', N'5UUGRGCJUY4BIPXXNUDO');
INSERT INTO Admin
(Id, Username, Password, IsSuperAdmin, CompanyId, PhoneNumber, SecretKey)
VALUES(122, N'ndz', N'a7753ed716a5740772a03dfab4365788614d2ac219cf45d38a123c105c836c4a', 0, 1, N'12', N'4CNVM43Z2EZ5KAQQ2XI4');
--SET IDENTITY_INSERT Admin OFF;	 
-- users
--SET IDENTITY_INSERT [User] ON;
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(3, N'test', N'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', N'123456', N'testtest', N'test@', 1, N'RKGSF4MBDKGNQM22MD3X');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(4, N'test2', N'60303ae22b998861bce3b28f33eec1be758a213c86c93c076dbe9f558c11c752', N'9992', N'testtest2', N'test2@', 1, N'IBAHDHYSOFWFMNIOHPY2');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(5, N'test3', N'fd61a03af4f77d870fc21e05e7e80678095c92d808cfb3b5c279ee04c74aca13', N'9994', N'testtest3', N'test3@', 2, N'AENRQCWIJ75EGVCAW27Q');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(6, N'test4', N'a4e624d686e03ed2767c0abd85c14426b0b1157d2ce81d27bb4fe4f6f01d688a', N'9994', N'testtest4', N'test4@', 2, N'SXHSKL3VSWUGMVBTCQBP');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(8, N'test2FA', N'858dc2fb9169d93cecfa2ed8468ee2e6aad992ee042331abd7614564eaf1cc3b', N'9990', N'testtest45', N'test45@', 1, N'LMY2MHJMR565ZFLFYSND');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(10, N'griza', N'0459f61b4d7cd31cc2aab93c90b43ce2cc60683f32dc5a562a30d1c9b5e2fc28', N'7777777', N'testtest777', N'testgriza@aa', 2, N'YEYUQPNQTV4TLR5TZKOE');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(51, N'dzajic', N'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', N'111111', N'dzajic', N'pp@example.com', 1, N'QYV6NZEFJVNHOF6LP7AF');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(57, N'user1', N'0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', N'062', N'User', N'u@gmail.com', 27, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(58, N'Username2', N'88e586bab89ddff842b77b06da49bc1b7b9adb1f05034a19a91834d93b1a129d', N'062185444', N'Tarikistan', N'mail@gmail.com', 21, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(64, N'aida', N'a3f9a909aa816e10ace873b59ad22164424f63b1987f0624803739475c94c255', N'033466111', N'Aida Z', N'aida@example.com', 1, N'4PY24LCQCQSNJMGXBKER');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(68, N'New1', N'4c94485e0c21ae6c41ce1dfe7b6bfaceea5ab68e40a2476f50208e526f506080', N'0001', N'New1', N'n1@gmail.com', 2, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(75, N'testUser', N'fd5cb51bafd60f6fdbedde6e62c473da6f247db271633e15919bab78a02ee9eb', N'1234567894', N'Test User', N'test@example.com', 2, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(78, N'Adnan1', N'256b93a925d9f71f4db05e2ce8a0a8c33cd6f13e907e62e0a8ac0dfbb29657dc', N'1252', N'Adnan', N'a@gmail.com', 64, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(80, N'mobilni', N'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', N'61123456', N'Mobilni User', N'mobilni@mobilni.com', 1, N'ZEEH3GH2V4MEPVKI4FXO');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(82, N'emirUser', N'95717ad2a39ff21655be2788d32dec929b3d713f26b64e536df0b2f6037794c9', N'1245', N'Emir User', N'euser@example.com', 1, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(101, N'dummy', N'b5a2c96250612366ea272ffac6d9744aaf4b45aacd96aa7cfcb931ee3b558259', N'123', N'Tariik', N'a@gmail.com', 37, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(102, N'Someone', N'5ad0e75a5119ff6de36d3fab783202c0224e685aa48461aed16aa72aa3960d21', N'2121', N'Some', N'ab@gmail.com', 37, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(103, N'amina', N'09b56f21e3c4370acc15a9e76ed4064f50d06085b630f7b2e736d8a90b369923', N'5454', N'Amina', N'am@gmail.com', 37, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(104, N'mobilni1', N'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', N'061', N'mobilni1', N'mobilni1@gmail.com', 1, N'ENEYZREOEJAHCWD5MBWA');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(106, N'juzer', N'8f9fb2d31a20a07c9f047361afc76e1e41e8408d879a9915afa3d3fc549e87ce', N'5215', N'Juzer', N'juzer@gmail.com', 37, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(108, N'asas', N'49b8ebd7fa9eb7eca44fcc7301b34c4ced40d2fe6647f273f2bb0e1fb4ad23c3', N'sasas', N'asasa', N'sasasss', 37, N'');
INSERT INTO User
(Id, Username, Password, PhoneNumber, FullName, Mail, CompanyId, SecretKey)
VALUES(111, N'tarik1', N'88e586bab89ddff842b77b06da49bc1b7b9adb1f05034a19a91834d93b1a129d', N'123', N'Tarik', N'tvelic1@etf.unsa.ba', 2, N'');
--SET IDENTITY_INSERT [User] OFF;	 
--campaigns
--SET IDENTITY_INSERT Campaign ON;
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(28, N'Proljetna promocija', N'Akcija i marketinške aktivnosti usmjerene na privlacenje kupaca.', 1, '2024-02-06 00:00:00.000', '2024-04-25 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(29, N'Ljetna akcija', N'Popusti na ljetne aranžmane. Najpovoljnije ljetovanje', 1, '2024-05-29 00:00:00.000', '2024-08-27 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(30, N'Bajramska radost', N'Posebne ponude za praznike uoci Bajrama', 1, '2024-12-01 00:00:00.000', '2024-12-31 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(31, N'Ljetna razglednica', N'Posebne ponude za ljetne aktivnosti', 1, '2024-07-01 00:00:00.000', '2024-08-31 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(32, N'Zimska avantura', N'Nauči skijati uz vrhunske instruktore', 1, '2024-01-03 00:00:00.000', '2024-01-13 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(33, N'Razgledanje Dubrovnika', N'Dubrovnik je jedan od najljepših gradova u Evropi', 2, '2024-06-26 00:00:00.000', '2024-07-03 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(34, N'Makarska', N'Makarska je jedna od najvećih atrakcija na Jadranu.', 2, '2024-06-13 00:00:00.000', '2024-07-16 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(35, N'Zagreb', N'Advent u Zagrebu je jedan od najlepsih adventa', 2, '2024-12-16 00:00:00.000', '2024-12-27 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(38, N'Budimpesta', N'Budimpesta je jedan od najljepših gradova na Dunavu', 2, '2024-04-05 00:00:00.000', '2024-04-20 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(39, N'Sarajevo', N'Sarajevo je jedan od najljepših gradova u Evropi.', 64, '2024-04-19 00:00:00.000', '2024-04-28 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(64, N'Campaign35', N'Some description for Campaigns..', 37, '2024-04-18 00:00:00.000', '2024-05-05 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(66, N'Zagreb Travel', N'Sarajevo je jedan od najljepših gradova u Evropi..', 37, '2024-04-10 00:00:00.000', '2024-05-01 00:00:00.000');
INSERT INTO Campaign
(Id, Name, Description, CompanyId, StartDate, EndDate)
VALUES(69, N'Skopje Travel', N'Skopje je glavni grad Makedonijee', 37, '2024-04-03 00:00:00.000', '2024-04-26 00:00:00.000');
--SET IDENTITY_INSERT Campaign OFF;
-- locations
--SET IDENTITY_INSERT Location ON;
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(55, N'Ulica', N'Envera Šehovica 14, Dolac Malta, 71000 Sarajevo', N'033333444', 29, NULL, N'Street');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(56, N'Restoran', N'Bazardžani 12', N'033555666', 30, NULL, N'Restoran s mediteranskom kuhinjom, popularan medu turistima i lokalnim stanovništvom.');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(57, N'Park', N'Ilidža, 71000 Sarajevo', N'033777888', 31, NULL, N'Very popular nature park');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(58, N'Park', N'Vidikovac 14', N'033999000', 30, NULL, N'Prostrani park s raznim rekreacijskim sadržajima, idealan za obiteljske izlete.');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(59, N'Planina', N'Bjelašnica 12', N'12345', 32, NULL, N'Vrhunske staze na Bjelašnici');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(60, N'Trg', N'Bascarsija, Sarajevo', N'789', 33, NULL, N'The most popular place in Sarajevo');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(61, N'Planina', N'Makarska Riviera', N'1244', 34, NULL, N'Biokovka je planina iznad Makarske');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(62, N'Trg', N'Trafalgar Square, London WC2N 5DS, UK', N'039', 35, NULL, N'The most popular square in London');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(64, N'Dvorac', N'Madjarska ulica', N'+354', 38, NULL, N'Prekrasan dvorac u Budimpešti, ledi pogled svojom ljepotom');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(65, N'Muzej', N'Zagrebacka', N'+385', 35, NULL, N'Muzej Nikole Tesle u Zagrebu');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(66, N'Dzamija', N'Ferhadija 89', N'458', 39, NULL, N'Begova dzamija je simbol Sarajevo');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(67, N'Dzamija', N'Alipasina 12', N'145', 30, NULL, N'Alipasina dzamije je simbol grada Sarajeva');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(72, N'Park', N'Maksimirski perivoj 1', N'000', 35, NULL, N'Opis');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(76, N'More', N'Mlini 12', N'+385', 29, NULL, N'Street');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(77, N'Planina', N'Makarsak 21', N'12345', 34, NULL, N'Biokovka je planina');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(82, N'Trg', N'Osmi mart 79', N'125', 29, NULL, N'Prekrasan predivan prelijep trg');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(85, N'Trg', N'Taksim Square, Sehit Muhtar, 34435 Beyoglu/Istanbul, Türkiye', N'+81 222 5252', 28, NULL, N'The most popular square in Istanbul');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(102, N'Loc', N'some12', N'454', 64, NULL, N'Some description');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(104, N'Planina', N'planinaa', N'21525', 66, NULL, N'Web application for exploring real estate');
INSERT INTO Location
(Id, TypeOfLocation, Address, ContactNumber, CampaignId, UserId, Description)
VALUES(113, N'abc', N'Abc', N'515', 69, NULL, N'Abc');
--SET IDENTITY_INSERT Location OFF;	 
-- user campaigns
--SET IDENTITY_INSERT UserCampaign ON;
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(23, 3, 29, N'accepted', NULL, N'done');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(25, 3, 30, N'accepted', NULL, N'working on it');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(26, 3, 31, N'accepted', NULL, N'working on it');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(28, 51, 29, N'accepted', NULL, N'done');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(29, 80, 30, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(30, 64, 31, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(31, 82, 32, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(33, 6, 34, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(34, 10, 35, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(35, 5, 35, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(38, 5, 38, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(39, 6, 35, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(40, 78, 39, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(41, 80, 28, N'accepted', NULL, N'done');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(42, 80, 29, N'accepted', NULL, N'working on it');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(43, 80, 30, N'declined', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(44, 80, 31, N'accepted', NULL, N'done');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(45, 80, 32, N'accepted', NULL, N'done');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(46, 80, 33, N'declined', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(47, 80, 34, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(48, 80, 35, N'accepted', NULL, N'working on it');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(49, 4, 30, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(58, 5, 34, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(60, 3, 28, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(65, 8, 28, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(70, 4, 29, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(73, 64, 28, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(76, 64, 30, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(82, 51, 31, N'accepted', NULL, N'working on it');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(87, 103, 64, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(90, 101, 66, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(91, 104, 28, N'accepted', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(92, 104, 28, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(97, 103, 66, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(98, 106, 69, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(111, 6, 33, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(112, 8, 30, N'none', NULL, N'none');
INSERT INTO UserCampaign
(Id, UserId, CampaignId, Status, LocationId, WorkingStatus)
VALUES(114, 64, 29, N'none', NULL, N'none');
--SET IDENTITY_INSERT UserCampaign OFF;	 
-- location status
--SET IDENTITY_INSERT LocationStatus ON;
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(2, 80, 85, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(4, 80, 65, N'visited');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(5, 80, 55, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(6, 80, 56, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(7, 80, 57, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(8, 80, 58, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(9, 80, 59, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(10, 80, 60, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(11, 80, 61, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(12, 80, 62, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(13, 80, 64, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(14, 80, 66, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(15, 80, 67, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(16, 80, 72, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(17, 80, 76, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(18, 80, 77, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(19, 80, 82, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(21, 3, 55, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(22, 104, 85, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(23, 3, 82, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(24, 51, 57, N'none');
INSERT INTO LocationStatus
(Id, UserId, LocationId, Status)
VALUES(25, 51, 55, N'none');
--SET IDENTITY_INSERT LocationStatus OFF;	 
-- record
--SET IDENTITY_INSERT Record ON;
INSERT INTO Record
(Id, SerialNumber, InventoryNumber, GPSCoordinates, FullAddress, PhotoUrl, LocationId, UserId, CreatedAt)
VALUES(21, N'SN19432064', N'1943206421', N'51.5080, -0.1281', N'Trafalgar Square, London WC2N 5DS, UK', N'https://fieldlogisticscontrol.blob.core.windows.net/locationimages/Trafalgar_Square%2C_London_2_-_Jun_2009.jpg', 62, 80, '2024-01-02 09:28:29.675');
INSERT INTO Record
(Id, SerialNumber, InventoryNumber, GPSCoordinates, FullAddress, PhotoUrl, LocationId, UserId, CreatedAt)
VALUES(22, N'SN41526380', N'4152638034', N'43.8598, 18.4313', N'Bascarsija, Sarajevo', N'https://fieldlogisticscontrol.blob.core.windows.net/locationimages/carsija.jpg', 60, 80, '2024-04-12 09:28:29.675');
INSERT INTO Record
(Id, SerialNumber, InventoryNumber, GPSCoordinates, FullAddress, PhotoUrl, LocationId, UserId, CreatedAt)
VALUES(23, N'SN70006232', N'70006232', N'43.8187, 18.2693', N'Ilidža, 71000 Sarajevo', N'https://fieldlogisticscontrol.blob.core.windows.net/locationimages/vrelo bosne.jpg', 57, 51, '2024-04-12 11:25:43.262');
INSERT INTO Record
(Id, SerialNumber, InventoryNumber, GPSCoordinates, FullAddress, PhotoUrl, LocationId, UserId, CreatedAt)
VALUES(24, N'SN06024520', N'0602452020', N'43.8187, 18.2693', N'Koševo, 71000 Sarajevo', N'https://fieldlogisticscontrol.blob.core.windows.net/locationimages/kosevo-1515078713.jpg', 76, 51, '2024-04-12 11:27:43.262');
INSERT INTO Record
(Id, SerialNumber, InventoryNumber, GPSCoordinates, FullAddress, PhotoUrl, LocationId, UserId, CreatedAt)
VALUES(25, N'SN70144433', N'7014443390', N'43.8487, 18.38', N'Envera Šehovića 14, Dolac Malta, 71000 Sarajevo', N'https://fieldlogisticscontrol.blob.core.windows.net/locationimages/envera sehovica.jpg', 55, 3, '2024-04-12 11:24:43.262');
INSERT INTO Record
(Id, SerialNumber, InventoryNumber, GPSCoordinates, FullAddress, PhotoUrl, LocationId, UserId, CreatedAt)
VALUES(30, N'SN51515515', N'65454', N'43.8598, 18.4313', N'Zagrebacka', N'https://fieldlogisticscontrol.blob.core.windows.net/locationimages/carsija.jpg', 65, 3, '2024-04-12 09:28:29.675');
INSERT INTO Record
(Id, SerialNumber, InventoryNumber, GPSCoordinates, FullAddress, PhotoUrl, LocationId, UserId, CreatedAt)
VALUES(38, N'111111', N'2222222', N'43.6550002, 17.9539555', N'Adres', N'https://fieldlogisticscontrol.blob.core.windows.net/locationimages/record-82-2024-05-02T22%3A52%3A31.939Z.jpeg', 82, 51, '2024-05-02 22:52:31.939');
INSERT INTO Record
(Id, SerialNumber, InventoryNumber, GPSCoordinates, FullAddress, PhotoUrl, LocationId, UserId, CreatedAt)
VALUES(41, N'Serijski', N'Inventarski', N'43.8602975, 18.4151836', N'Adresa', N'https://fieldlogisticscontrol.blob.core.windows.net/locationimages/record-85-2024-05-08T13%3A24%3A37.713Z.jpeg', 85, 80, '2024-05-08 13:24:37.713');
--SET IDENTITY_INSERT Record OFF;

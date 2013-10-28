drop table if exists CM_CortexCachedDependencies, CM_CortexPendingDependencies, 
    CM_CortexCombo, CM_CortexDependencies;

-- create CM_CortexDependencies
CREATE TABLE CM_CortexDependencies
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL,
    Version varchar(20) NOT NULL,
    Dependencies text,
    Csses text,
    PRIMARY KEY (Id),
    UNIQUE INDEX (Name, Version)
);


CREATE TABLE CM_CortexCombo
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL,
    Version varchar(20) NOT NULL,
    ComboId varchar(50) NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY(Name, Version) REFERENCES CM_CortexDependencies(Name, Version) ON DELETE CASCADE ON UPDATE CASCADE
);


-- create CM_CortexPendingDependencies
CREATE TABLE CM_CortexPendingDependencies
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL, -- 
    Version varchar(20) NOT NULL,
    NameAffected varchar(50) NOT NULL,
    VersionAffected varchar(20) NOT NULL,
    PRIMARY KEY (Id),
    UNIQUE INDEX (Name, Version, NameAffected, VersionAffected)
);


CREATE TABLE CM_CortexCachedDependencies
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL,
    Version varchar(20) NOT NULL,
    Dependencies text,
    Csses text,
    PRIMARY KEY (Id),
    UNIQUE INDEX (Name, Version)
);


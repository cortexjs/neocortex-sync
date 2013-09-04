drop table if exists CM_cortexCachedDependencies, CM_cortexPendingDependencies, CM_cortexCombo, CM_cortexDependencies;

-- create CM_cortexDependencies
CREATE TABLE CM_cortexDependencies
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL,
    Version varchar(20) NOT NULL,
    Dependencies text,
    PRIMARY KEY (Id),
    UNIQUE INDEX (Name, Version)
);


CREATE TABLE CM_cortexCombo
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL,
    Version varchar(20) NOT NULL,
    ComboId varchar(32) NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY(Name, Version) REFERENCES CM_cortexDependencies(Name, Version) ON DELETE CASCADE ON UPDATE CASCADE
);


-- create CM_cortexPendingDependencies
CREATE TABLE CM_cortexPendingDependencies
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL, -- 
    Version varchar(20) NOT NULL,
    NameAffected varchar(50) NOT NULL,
    VersionAffected varchar(20) NOT NULL,
    PRIMARY KEY (Id),
    UNIQUE INDEX (Name, Version, NameAffected, VersionAffected)
);


CREATE TABLE CM_cortexCachedDependencies
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL,
    Version varchar(20) NOT NULL,
    Dependencies text,
    PRIMARY KEY (Id),
    UNIQUE INDEX (Name, Version)
);


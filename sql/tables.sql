drop table if exists CM_CortexCachedDependencies, CM_CortexPendingDependencies,
    CM_CortexCombo, CM_CortexPackageDependencies;

-- create CM_CortexPackageDependencies
CREATE TABLE CM_CortexPackageDependencies
(
    Id int NOT NULL AUTO_INCREMENT,
    Name varchar(50) NOT NULL,
    Version varchar(20) NOT NULL,
    Dependencies text,
    Csses text,
    Size int(11) COMMENT 'Gzipped size from compressed main file',
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
    FOREIGN KEY(Name, Version) REFERENCES CM_CortexPackageDependencies(Name, Version) ON DELETE CASCADE ON UPDATE CASCADE
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


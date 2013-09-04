DROP VIEW IF EXISTS CM_cortexPendingCachedView;


CREATE VIEW `CM_cortexPendingCachedView` AS
    SELECT 
        a.Name,
        a.Version,
        a.NameAffected,
        a.VersionAffected,
        b.Dependencies
    FROM
        CM_cortexPendingDependencies as a,
        CM_cortexCachedDependencies b
    WHERE
        a.NameAffected = b.Name
            AND a.VersionAffected = b.Version
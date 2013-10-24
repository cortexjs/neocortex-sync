DROP VIEW IF EXISTS CM_CortexPendingCachedView;

CREATE VIEW `CM_CortexPendingCachedView` AS
    SELECT 
        a.Name,
        a.Version,
        a.NameAffected,
        a.VersionAffected,
        b.Dependencies
    FROM
        CM_CortexPendingDependencies as a,
        CM_CortexCachedDependencies b
    WHERE
        a.NameAffected = b.Name
            AND a.VersionAffected = b.Version

TRUNCATE TABLE CM_CortexDependencies;
TRUNCATE TABLE CM_CortexCombo;

INSERT INTO CM_CortexDependencies  (Name, Version, Dependencies, Csses) 
    VALUES ('type', '1.1.0', '', ''), ('type', '1.1.1', '', ''), ('type', '1.1.2', '', ''), 
    ('indexof', '0.3.0', '', ''), ('indexof', '0.3.1', '', ''), ('jsonp', '0.0.1', 'type@~1.1.0,indexof@0.3.0', ''),
    ('combobox', '0.0.1', 'jsonp@0.0.1,type@1.1.1', 'combobox'),
    ('mbox', '0.1.0', '', 'mbox'), ('tablet', '0.0.1', 'mbox@~0.1.0', 'tablet');

INSERT INTO CM_CortexCombo (Name, Version, ComboId)
    VALUES ('type', '1.1.0', '0'), ('type', '1.1.1', '1'), ('indexof', '0.3.0', '0'), ('indexof', '0.3.1', '1');



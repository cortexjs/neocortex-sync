DELETE FROM CM_CortexDependencies;
DELETE FROM CM_CortexCombo;

INSERT INTO CM_CortexDependencies  (Name, Version, Dependencies, Csses) 
    VALUES ('type', '1.1.0', '', ''), ('type', '1.1.1', '', ''), ('type', '1.1.2', '', ''), ('type', '1.1.3', '', ''), 
    ('indexof', '0.3.0', '', ''), ('indexof', '0.3.1', '', ''), 
    ('jsonp', '0.0.1', 'type@~1.1.0,indexof@0.3.0', ''),
    ('jsonp', '0.0.2', 'type@~1.1.0,indexof@0.3.1', ''),
    ('combobox', '0.0.1', 'jsonp@0.0.1,type@1.1.1', 'combobox.css'),
    ('app-main-facade', '0.1.2', 'combobox@~0.0.1,jsonp@~0.2.1', ''),
    ('mbox', '0.1.0', '', ''), ('mbox', '0.1.1', '', 'mbox.css'), ('mbox', '0.1.2', '', 'mbox.css,util/border.css'), 
    ('tablet', '0.0.1', 'mbox@~0.1.0', 'tablet.css');

INSERT INTO CM_CortexCombo (Name, Version, ComboId)
    VALUES ('type', '1.1.0', '0'), ('type', '1.1.1', '1'),
    ('type', '1.1.3', '1'),
    ('indexof', '0.3.0', '0'), ('indexof', '0.3.1', '1');


INSERT INTO CM_CortexDependencies (Name, Version, Dependencies)
    VALUES
('app-main-citylist','0.0.2','jquery@1.9.2,request@0.1.0,json@0.1.0,fx@0.1.0,suggest@0.1.0,align@0.1.0')
('align','0.1.0','lang@0.1.0,jquery@1.9.2'),
('asset','0.1.0',''),
('class','0.1.0','lang@0.1.0'),
('fx','0.1.0','class@0.1.0,jquery@1.9.2'),
('jquery','1.9.2',''),
('json','0.1.0',''),
('lang','0.1.0',''),
('tpl','0.1.0',''),
('request','0.1.0','class@0.1.0,asset@0.1.0'),
('suggest','0.1.0','jquery@1.9.2,class@0.1.0'),
('hippo','0.1.0','jquery@1.9.2'),
('app-main-header-bar','0.1.1','jquery@1.9.2,request@0.1.0,tpl@0.1.0'),
('app-main-header-bar','0.1.0','jquery@1.9.2,request@0.1.0,tpl@0.1.0')



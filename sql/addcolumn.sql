alter table `CM_CortexPackageDependencies` add COLUMN `Size` int(11) COMMENT 'Gzipped size from compressed main file';
alter table `CM_CortexPackageDependencies` add COLUMN `AsyncDependencies` text;
alter table `CM_CortexPackageDependencies` add COLUMN `NoJS` tinyint(1);
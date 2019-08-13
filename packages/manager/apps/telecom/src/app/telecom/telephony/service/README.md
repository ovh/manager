# Service folder

## Why

As there are some functionalities that are the same between service types (line, number), there are "shared view" : this is the goal of this folder. All functionalities that we can share between services should be in this folder.

For example : consumption is exactly the same in line and number. The state declarations stay into "number"/"line" directories but main views are inside "service" directory.

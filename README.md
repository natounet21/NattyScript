# NattyScript
A useless language i made
# Syntax of the exe
`./nat.exe <file>` it will compile to /dist and create libs to directly run it use `--run`
# Syntax
## Keywords
let {TYPE} {NAME} {CONTENT} - set a variable
(Type can be object, arrays, number or strings)

print {CONTENT} - print

ask {QUESTION} - prompt a question

readfile {FILE} - read a file and set the content to output and if the file is empty its set $output

writefile {FILE} {CONTENT} - write a file

_iife - WARNING THIS IS ADVANCED. it moves where the iife start is

loop {NUMBER} - loops a code for a certain time

forever - make a while loop

end - close the bracket in js

if {STATEMENT} - what you put it will compiled like this : `if ({ARGUMENT}) {`

else - a else statement

else_if {STATEMENT} - what you put it will compiled like this : `} else if ({ARGUMENT}) {`

func {NAME} {ARG} - makes a function

call {NAME} {ARG (optionnal)} - simply calls the function

= {VARIABLE_NAME} {CONTENT} - set a variable content

custom {LINE} - simply put your code directly in the compiled file

import {LIBRARY_NAME} - import a lib from the libs folder

## MISCS
To make variables in a string put `$VARIABLE_NAME$` (NOT IN IF STATEMENTS WARNING)
when there is an output or input entered it will put it in the output variable
## LIBARARIES
There is default librraies if you put in your libs folder and import them you can use.
(I'm too lazy to doc them right now)
# Examples
## Hello World
```NattyScript
print Hello, World!
```
## 1+1 (Using the math lib)
```NattyScript
import math
let num = 1
let num2 = 1
add num $num2$
print $output$
```
## 

This is work in progress (Source code gonna be upload soon)

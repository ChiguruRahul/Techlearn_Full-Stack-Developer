const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data (safe for demo)
  await prisma.note.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.course.deleteMany();

  const course = await prisma.course.create({
    data: { title: "Demo Course - Full Stack Topics" },
  });

  const topicsData = [  
    {
      title: "Introduction To Python",
      content: `## History
Python is a high-level, interpreted, interactive, and object-oriented scripting language. It was developed by Guido van Rossum in the late 1980s and early 1990s at the National Research Institute for Mathematics and Computer Science in the Netherlands. Python is derived from several languages like C, C++, SmallTalk, Algol-68, and other scripting languages. It is general-purpose, versatile, concise, easy to read, and can be used in web development, software development, and scientific applications.

## Features
- Easy to read, learn, and maintain.
- Comes with a standard library that is portable and cross-platform compatible.
- Strong support for modules and packages.
- Provides extensive support for major databases like MySQL and Oracle.
- Suitable for developing Windows-based applications.
- Supports functional, structured, and object-oriented programming paradigms.
- Offers automatic garbage collection.
- Supports dynamic type checking and conversion.

## Setting Up Python
Download the latest version of Python from: https://www.python.org/downloads/  
Install the Python interpreter.  
Execute Python code using IDLE (Integrated Development Environment) or via the command prompt.

Python code can be written and executed in several ways:

1. Using the Python shell (IDLE): Type a line of Python code and press Enter. The interpreter processes it and returns the output.
2. Writing Python scripts in a new file within IDLE and executing using 'Run' or pressing F5.
3. Running saved Python files using the 'import' keyword in the shell or executing from the command prompt.

\`\`\`python
# Example: test.py
print('Hello World!')

>>> import test
# Output: Hello World!

# Example: test2.py
print('Program started')
x = 10
y = 20
z = x + y
print(x, y, z)
print('Program ends')

>>> import test2
# Output:
# Program started
# 10 20 30
# Program ends

>>> print(test2.x, test2.y, test2.z)
# Output: 10 20 30

# Importing specific variables
from test2 import z
print(z)

from test2 import x, y, z
print(x, y, z)
\`\`\`

From the command prompt, type \`python\` to open the shell or \`python filename.py\` to run a script.

## Identifiers
Naming conventions for identifiers:

- Class names start with an uppercase letter.
- Other identifiers start with a lowercase letter.
- Single leading underscore: indicates a private identifier.
- Double leading underscores: strongly private identifier.
- Leading and trailing double underscores: language-defined special names.

## Keywords
Python has 33 keywords, including:

\`and, exec, not, assert, finally, or, break, for, pass, class, from, print, continue, global, raise, def, if, return, del, import, try, elif, in, while, else, is, with, except, lambda, yield\`

Python uses indentation instead of braces to define blocks of code. All statements within a block must be indented consistently.

Use the \`#\` symbol to write comments.

\`\`\`python
# This is a comment
# Written by TechLearn Solutions
print('Hello World')
print("Welcome to TechLearn!")
print("""Computer Training & Development
2nd Floor, Surabhi Complex, AS Rao Nagar, ECIL, Hyderabad-500062.""")
\`\`\`

Variables are nothing but reserved memory locations to store values. This means, when you create a variable, you reserve some space in memory.

Based on the data type of a variable, the interpreter allocates memory and decides what can be stored in the reserved memory. Therefore, by assigning different data types to variables, you can store integers, decimals, or characters in these variables.

## Assigning Values
\`\`\`python
var = 100
var2 = 12.56
var3 = "techlearn solutions"
var4 = 'python programming'

print(var)
print(var2)
print(var3)
print(var4)
\`\`\`

## Multiple Assignment
\`\`\`python
a = b = c = 1
print(a, b, c)

x, y, z = 1, 'tech', 12.5
print(x)
print(y)
print(z)
\`\`\`

## Standard Data Types
Python supports the following data types:

- Numbers (int, float, complex)
- Strings
- List [ ]
- Tuple ( )
- Set { }
- Dictionary {key: value}
- Boolean (True/False)
- None (no value)

## Numbers
\`\`\`python
# Integer examples:
x = 0b1100      # Binary
y = 0o14        # Octal
z = 0xc         # Hexadecimal

# Underscores can be used as visual separators:
x = 1_23_450
print(type(x))  # Output: <class 'int'>
\`\`\`

## Float
\`\`\`python
x = 5.01234567890123456789
print(x)  # Output: rounded to 15 decimal places
\`\`\`

## Complex Numbers
\`\`\`python
a = 5 + 2j
print(a)
print(type(a))  # Output: <class 'complex'>
\`\`\`

## 📘 Number Systems in Python: Binary, Octal, and Hexadecimal
Python natively supports these formats by using prefixes to indicate the base of a literal value.

### Binary Numbers in Python
Prefix: \`0b\` or \`0B\`  
Example:
\`\`\`python
x = 0b00001100
print(x)  # Output: 12
\`\`\`

### Octal Numbers in Python
Prefix: \`0o\` or \`0O\`  
Example:
\`\`\`python
x = 0o12
print(x)  # Output: 10
\`\`\`

### Hexadecimal Numbers in Python
Prefix: \`0x\` or \`0X\`  
Example:
\`\`\`python
a = 0xc
print(a)  # Output: 12
\`\`\`

## Strings
Strings are sequences of characters enclosed in quotes (single or double). They are index-based.

\`\`\`python
s1 = "TECHLEARN"
print(s1[5])  # Output: L

print(s1[0:4])   # Output: TECH
print(s1[-5:])   # Output: LEARN

str = "Hello World"
print(str)
print(str[0])
print(str[0:])
print(str[2:])
print(str*2)
print(str + " Welcome to TechLearn")
\`\`\`

## Lists
Lists are mutable sequences enclosed in square brackets \`[]\`.

\`\`\`python
list = ['tech', 900066, 12.23, 'sujith', 70.2]
list2 = [3, 4, 5]
print(list)
print(list[0])
print(list[0:])
print(list[2:])
print(list*2)
print(list + list2)
list[0] = 'techlearn'
print(list)
\`\`\`

## Tuples
Tuples are immutable sequences enclosed in parentheses \`()\`.

\`\`\`python
tup1 = (1, 2, "tech", 9676663136)
tup2 = (3, 4, 5, 6, 7)
print(tup1)
print(tup2)
# tup1[0] = "first"  # Error: tuples are immutable
\`\`\`

## Dictionaries
Dictionaries are collections of key-value pairs enclosed in curly braces \`{}\`.

\`\`\`python
dic = {1: 'one', 2: 'two', 3: 'three'}
print(dic)
print(dic[2])
print(dic.keys())
print(dic.values())
dic[2] = 'second'
print(dic)
\`\`\`

## Boolean Type
\`\`\`python
num = 12
print(num > 0)  # Output: True
\`\`\`

## NoneType
Represents the absence of a value.

\`\`\`python
x = None
print(type(x))  # Output: <class 'NoneType'>
\`\`\`
`,
    },

    // =========================
    // TOPIC 2 (Column 2)
    // =========================
    {
      title: "General Functions",
      content: `## print() Function
The \`print()\` function is one of the most commonly used built-in functions in Python. It is used to display data on the standard output device (i.e., the console or terminal). Whether you're debugging your code or presenting output to a user, \`print()\` is the go-to function.

### a) Printing Different Data Types
The \`print()\` function can be used to display values of all fundamental Python data types:

\`\`\`python
print('Hello')                           # String (str) type
print(100)                               # Integer (int) type
print(3.14)                              # Floating-point (float) type
print([1, 2, 3, 4])                      # List (list) type
print((5, 6, 7))                         # Tuple (tuple) type
print({1, 2, 3, 10, 4})                  # Set (set) type
print({1: 'One', 2: 'Two', 3: 'Three'})  # Dictionary (dict) type
print(True)                              # Boolean (bool) type
print(3 + 4j)                            # Complex number (complex) type
print(None)                              # NoneType (None) – represents the absence of value
\`\`\`

### b) Printing Variables
Python allows you to store data in variables and later print them.

\`\`\`python
name = 'Techlearn Solutions'
mobile = 9000663666
email = 'techlearnsolutions@gmail.com'
print(name)
print(mobile)
print(email)
\`\`\`

Output:
\`\`\`
Techlearn Solutions
9000663666
techlearnsolutions@gmail.com
\`\`\`

### c) Printing Multiple Values Together
\`\`\`python
print(1, 2, 3, 4)
print('TechLearn', 9676663136, 'AS Rao Nagar')
\`\`\`

Output:
\`\`\`
1 2 3 4
TechLearn 9676663136 AS Rao Nagar
\`\`\`

### d) Ways to Print Strings Along With Values

#### 1) Using Commas
\`\`\`python
name = 'Techlearn Solutions'
mobile = 9000663666
print('Name :', name)
print('Mobile:', mobile)
\`\`\`

Output:
\`\`\`
Name : Techlearn Solutions
Mobile: 9000663666
\`\`\`

#### 2) Using String Concatenation (+)
\`\`\`python
name = 'Techlearn Solutions'
print('Name : ' + name)
\`\`\`

> Note: You can only concatenate strings with strings. Convert numbers using \`str()\` when needed.

---

## e) Type Conversion / Type Casting

### str() Function
\`\`\`python
print(str(5))          # Output: '5'
print(str(5.6))        # Output: '5.6'
\`\`\`

### int() Function
\`\`\`python
a = int('56')
b = int('60')
c = a + b
print(c)               # Output: 116
\`\`\`

> ⚠️ \`int('12.5')\` raises ValueError.

### float() Function
\`\`\`python
a = 5
b = float(a)
print(b)               # Output: 5.0

c = '12.3'
d = float(c)
print(d)               # Output: 12.3
\`\`\`

### list() Function
\`\`\`python
x = '[1,2,3]'         # string, not list
aList = list(x)       # each character becomes an element

y = 'TECH'
bList = list(y)       # ['T','E','C','H']

print(type(x))        # <class 'str'>
print(type(aList))    # <class 'list'>
print(type(bList))    # <class 'list'>
\`\`\`

### tuple() Function
\`\`\`python
x = '(1,2,3)'         # string
aTuple = tuple(x)

y = 'TECH'
bTuple = tuple(y)

print(type(x))        # <class 'str'>
print(type(aTuple))   # <class 'tuple'>
print(type(bTuple))   # <class 'tuple'>
\`\`\`

---

## f) Real-Life Example Using Type Conversion
\`\`\`python
gold_rate = 6605
print('Gold rate today in Hyderabad is: ' + str(gold_rate))
\`\`\`

---

## g) Using Format Specifiers
\`\`\`python
length = 5
breadth = 3
area = length * breadth
print('Length = %d' % length)
print('Breadth = %d' % breadth)
print('Area = %d' % area)
\`\`\`

\`\`\`python
name = 'India'
capital = 'Delhi'
population = 1449297353
print("Country: %s Capital: %s Population: %d" % (name, capital, population))
\`\`\`

---

## h) Using f-Strings
\`\`\`python
x = 5
y = 3
print(f'value of x={x} and value of y={y}')
\`\`\`

Output:
\`\`\`
value of x=5 and value of y=3
\`\`\`

---

## type() Function
\`\`\`python
a = 5
print(type(a))          # <class 'int'>
print(type('Techlearn'))# <class 'str'>
\`\`\`

---

## input() Function
The \`input()\` function always returns input as a string.

\`\`\`python
a = input('Enter a value: ')
print(type(a))  # <class 'str'>
\`\`\`

Example with Type Casting:
\`\`\`python
x = input('Enter x value: ')
y = input('Enter y value: ')
z = input('Enter list of 3 values: ')

num1 = int(x)
num2 = float(y)
num3 = list(z)

print(type(x))
print(type(num1))
print(type(y))
print(type(num2))
print(type(z))
print(type(num3))

print(x + y)
print(z)
\`\`\`

---

## id() Function
\`\`\`python
a = 5
b = 5
print(id(a), id(b))

a = [1, 2, 3]
b = [1, 2, 3]
print(id(a), id(b))
\`\`\`

---

## sum() Function
\`\`\`python
a = [1, 2, 3]
b = [1.2, 2.2, 3.2]
c = [3 + 4j, 5 + 2j, 6 + 3j]
d = [5, 3.5, 2 + 3j]

print(sum(a))
print(sum(b))
print(sum(c))
print(sum(d))
\`\`\`

---

## max() Function
\`\`\`python
print(max(1, 10, 3, 5))
x = [1, 12, 3]
print(max(x))
y = 'LEARN'
print(max(y))
\`\`\`

---

## min() Function
\`\`\`python
print(min(1, 10, 3, 5))
x = [1, 12, 3]
print(min(x))
\`\`\`

---

## round() Function
\`\`\`python
print(round(567.589))
print(round(567.539, 2))
print(round(567.582))
print(round(567.582, -1))
print(round(4567.582, -2))
print(round(4537.582, -2))
print(round(4567.582, -3))
\`\`\`

---

## len() Function
\`\`\`python
x = [11, 52, 30, 24, 15]
print(len(x))
\`\`\`

---

## Bonus: math Module
\`\`\`python
import math
print(math.e)
print(math.pi)
print(math.sqrt(625))
print(math.factorial(5))
\`\`\`

---

## abs() Function
\`\`\`python
n = -45
print(abs(n))
\`\`\`

---

## any() Function
\`\`\`python
lights1 = [0, 0, 0, 0, 0, 0]
lights2 = [0, 0, 0, 1, 0, 0]
print(any(lights1))
print(any(lights2))
\`\`\`

---

## all() Function
\`\`\`python
std = [45, 98, 76, 88, 65, 90]
print(all(std))

std2 = [56, 90, 89, 19, 0, 80]
print(all(std2))
\`\`\`

---

## dir() Function
\`\`\`python
name = 'tech'
mobile = 987666
print(dir())
\`\`\`

---

## divmod()
\`\`\`python
a = 5
b = 2
c = divmod(a, b)
print(c)
\`\`\`

---

## iter() + next()
\`\`\`python
x = [10, 20, 30, 40]
i = iter(x)
print(next(i))
print(next(i))
\`\`\`

---

## range()
\`\`\`python
print('Value in range of 5 using for each loop:')
for val in range(5):
    print(val, end=' ')
\`\`\`

\`\`\`python
r2 = range(5)
itr = iter(r2)
print('Values using iter():')
print(next(itr), end=' ')
print(next(itr), end=' ')
print(next(itr), end=' ')
print(next(itr), end=' ')
print(next(itr), end=' ')
\`\`\`

---

## chr()
\`\`\`python
print(chr(65))
print(chr(63))
print(chr(93))
print(chr(61))
print(chr(48))
\`\`\`

---

## ord()
\`\`\`python
print(ord('a'), end=' ')
print(ord(';'), end=' ')
print(ord('+'), end=' ')
print(ord('9'), end=' ')
print(ord('Z'), end=' ')
\`\`\`

---

## zip()
\`\`\`python
state = ('Telangana', 'Tamilnadu', 'Karnataka')
capital = ('Hyderabad', 'Chennai', 'Bengaluru')
state_capital = zip(state, capital)

print(state_capital)
print(type(state_capital))

for val in state_capital:
    print(val)
\`\`\`

---

## Summary
- \`type()\` returns the data type.
- \`input()\` takes input as string.
- \`id()\` returns memory address.
- \`sum()\` adds numeric elements.
- \`max()/min()\` finds highest/lowest values.
- \`round()\` rounds numbers.
- \`len()\` counts elements.
- \`abs()\` absolute value.
- \`any()/all()\` check truthiness in collections.
- \`dir()\` lists attributes/methods.
- \`divmod()\` gives quotient + remainder.
- \`iter()+next()\` iterates manually.
- \`range()\` generates number sequences.
- \`chr()/ord()\` ASCII/Unicode conversion.
- \`zip()\` pairs items from iterables.
`,
    },

    // =========================
    // TOPIC 3 (Column 3)
    // =========================
    {
      title: "Operators",
      content: `## Operators in Python
### Introduction to Operators
In Python, operators are special symbols or keywords used to perform operations on variables and values. These operations can include arithmetic calculations, comparisons, logical evaluations, and more.

### Types of Operators in Python
Python provides the following categories of operators:
- Arithmetic Operators
- Comparison (Relational) Operators
- Assignment Operators
- Logical Operators
- Bitwise Operators
- Membership Operators
- Identity Operators

---

## Arithmetic Operators
Assume:
\`\`\`python
a = 10
b = 20
\`\`\`

| Operator | Description | Example | Result |
|---|---|---:|---:|
| + | Addition | a + b | 30 |
| - | Subtraction | a - b | -10 |
| * | Multiplication | a * b | 200 |
| / | Division (float) | a / b | 0.5 |
| // | Floor Division | a // b | 0 |
| % | Modulus (Remainder) | a % b | 10 |
| ** | Exponentiation | a ** 2 | 100 |

---

## Comparison (Relational) Operators

| Operator | Description | Example | Result |
|---|---|---:|---:|
| == | Equal to | a == b | False |
| != | Not equal to | a != b | True |
| > | Greater than | a > b | False |
| < | Less than | a < b | True |
| >= | Greater than or equal to | a >= b | False |
| <= | Less than or equal to | a <= b | True |

\`\`\`python
print(a == b) # False
print(a < b)  # True
\`\`\`

---

## Assignment Operators

| Operator | Description | Example | Equivalent To |
|---|---|---:|---|
| = | Assign | a = 10 | a = 10 |
| += | Add and assign | a += b | a = a + b |
| -= | Subtract and assign | a -= b | a = a - b |
| *= | Multiply and assign | a *= b | a = a * b |
| /= | Divide and assign | a /= b | a = a / b |
| //= | Floor divide and assign | a //= b | a = a // b |
| %= | Modulus and assign | a %= b | a = a % b |
| **= | Exponent and assign | a **= 2 | a = a ** 2 |

---

## Logical Operators

| Operator | Description | Example | Result |
|---|---|---:|---:|
| and | Logical AND | a > 5 and b < 30 | True |
| or | Logical OR | a < 5 or b < 30 | True |
| not | Logical NOT | not(a > 5) | False |

---

## Bitwise Operators
Let:
\`\`\`python
a = 60  # 0011 1100
b = 13  # 0000 1101
\`\`\`

| Operator | Name | Example | Result |
|---|---|---:|---:|
| & | AND | a & b | 12 |
| \\| | OR | a \\| b | 61 |
| ^ | XOR | a ^ b | 49 |
| ~ | NOT | ~a | -61 |
| << | Left Shift | a << 2 | 240 |
| >> | Right Shift | a >> 2 | 15 |

Examples:
\`\`\`python
print(a & b)   # 12
print(a | b)   # 61
print(a ^ b)   # 49
print(~a)      # -61
print(a << 2)  # 240
print(a >> 2)  # 15
\`\`\`

---

## Membership Operators

| Operator | Description | Example | Result |
|---|---|---:|---:|
| in | True if present | 'a' in 'apple' | True |
| not in | True if not present | 'x' not in 'apple' | True |

---

## Identity Operators
Identity operators compare memory location of objects.

| Operator | Description | Example | Result |
|---|---|---:|---:|
| is | Same object | a is b | False |
| is not | Different object | a is not b | True |

---

## Operator Precedence (High → Low)
1. \`**\`  
2. \`+x, -x, ~x\`  
3. \`*, /, //, %\`  
4. \`+, -\`  
5. \`<<, >>\`  
6. \`&\`  
7. \`^, |\`  
8. \`<, <=, >, >=\`  
9. \`==, !=\`  
10. Assignments (\`=, +=, ...\`)  
11. \`is, is not\`  
12. \`in, not in\`  
13. \`not, and, or\`

> Tip: Use parentheses \`()\` to make precedence explicit.
`,
    },

    // =========================
    // TOPIC 4
    // =========================
    {
      title: "Control Statements",
      content: `## Control Statements in Python
Control statements allow Python programs to make decisions, repeat actions, or jump out of loops.

Python supports three broad categories:
- **Decision-Making Statements**
- **Looping Statements**
- **Jump Statements**

---

## Decision Making Statements

### a) if Statement
Executes a block if condition is **True**.

\`\`\`python
age = 20
if age >= 18:
    print("You are eligible to vote.")
\`\`\`

### b) if...else Statement
Chooses between two blocks.

\`\`\`python
age = 16
if age >= 18:
    print("Eligible to vote")
else:
    print("Not eligible to vote")
\`\`\`

### c) if...elif...else Ladder
Used when multiple conditions need to be checked.

\`\`\`python
score = 85
if score >= 90:
    print("Grade A")
elif score >= 75:
    print("Grade B")
elif score >= 60:
    print("Grade C")
else:
    print("Fail")
\`\`\`

### d) Nested if Statements
\`\`\`python
username = "admin"
password = "admin123"

if username == "admin":
    if password == "admin123":
        print("Login successful")
    else:
        print("Incorrect password")
else:
    print("Unknown user")
\`\`\`

### e) Dictionary as switch Replacement
Python has no built-in switch, but dictionary mapping can simulate it.

\`\`\`python
def menu(option):
    return {
        1: "Start",
        2: "Settings",
        3: "Exit"
    }.get(option, "Invalid choice")

print(menu(1))
\`\`\`

---

## Looping Statements

### a) while Loop
\`\`\`python
i = 1
while i <= 5:
    print(i)
    i += 1
\`\`\`

### b) for Loop with range()
\`\`\`python
for i in range(1, 6):
    print(i)
\`\`\`

### c) for Loop with Collections
\`\`\`python
colors = ["red", "blue", "green"]
for color in colors:
    print(color)
\`\`\`

### d) Nested Loops
\`\`\`python
for i in range(3):
    for j in range(2):
        print(f"i={i}, j={j}")
\`\`\`

---

## Jump Statements

### a) break
\`\`\`python
for i in range(10):
    if i == 5:
        break
    print(i)
\`\`\`

### b) continue
\`\`\`python
for i in range(5):
    if i == 2:
        continue
    print(i)
\`\`\`

### c) pass
\`\`\`python
if True:
    pass
\`\`\`

---

## Practice Programs

### 1) User Login System
\`\`\`python
stored_username = 'techlearn'
stored_password = 'tls@2014'

username = input("Enter your username: ").strip()
password = input("Enter your password: ").strip()

if username == "" or password == "":
    print("Enter the username/password.")
elif username == stored_username and password == stored_password:
    print("Hello! Techlearn")
else:
    print("Invalid Username/Password")
\`\`\`

### 2) Password Change System
\`\`\`python
actual_password = "tls@2014"
old_password = input("Enter old password: ").strip()

if old_password != actual_password:
    print("Wrong Password")
else:
    new_password = input("Enter new password: ").strip()
    confirm_password = input("Re-enter new password: ").strip()
    if new_password != confirm_password:
        print("New Passwords do not match")
    else:
        actual_password = new_password
        print("Password updated successfully!")
\`\`\`

### 3) Bank Account Debit Simulation
\`\`\`python
account_no = 12345
balance = 12000

debit_amount = int(input("Enter amount to withdraw: "))

if debit_amount > 20000:
    print("Daily limit exceeded")
elif debit_amount % 100 != 0:
    print("Enter only multiple’s of 100’s")
elif debit_amount > balance:
    print("Insufficient Balance")
else:
    balance -= debit_amount
    print(f"Transaction successful. New balance: ₹{balance}")
\`\`\`

### 4) Strong Password Validator
\`\`\`python
import string

old_password = "tls@2014"
new_password = input("Enter new password: ")

if len(new_password) < 9:
    print("Password too short. Minimum 9 characters required.")
elif new_password == old_password:
    print("New password must be different from the old password.")
elif " " in new_password:
    print("Password must not contain spaces.")
elif not any(c.islower() for c in new_password):
    print("Password must include a lowercase letter.")
elif not any(c.isupper() for c in new_password):
    print("Password must include an uppercase letter.")
elif not any(c.isdigit() for c in new_password):
    print("Password must include a digit.")
elif not any(c in string.punctuation for c in new_password):
    print("Password must include a special character.")
else:
    print("Strong password!")
\`\`\`

### 5) Swiggy/Zomato Offer Calculator
\`\`\`python
total = float(input("Enter order total: ₹"))

delivery_fee = 40
platform_charge = 0.05 * total

if total >= 500:
    discount = 0.20 * total
elif total >= 300:
    discount = 0.10 * total
else:
    discount = 0.0

final_amount = total + platform_charge + delivery_fee - discount

print(f"Subtotal: ₹{total}")
print(f"Platform charges: ₹{platform_charge:.2f}")
print(f"Delivery fee: ₹{delivery_fee}")
print(f"Discount applied: ₹{discount:.2f}")
print(f"Final amount to pay: ₹{final_amount:.2f}")
\`\`\`
`,
    },

    // =========================
    // TOPIC 5
    // =========================
    {
      title: "Data Types and Methods",
      content: `## Python Notes – Data Types and Methods

Python provides several built-in data types:
- Numeric Types
- Sequence Types
- Mapping Types
- Set Types
- Boolean Type
- Binary Types
- None Type

---

## Numeric Types

### int
\`\`\`python
x = 100
print(type(x))

x = 5
print(x.numerator)
print(x.denominator)
\`\`\`

### float
\`\`\`python
y = 7.25
print(type(y))
\`\`\`

### complex
\`\`\`python
z = 2 + 3j
print(z.real)
print(z.imag)
\`\`\`

---

## Sequence Types

### str (String)
Strings are immutable and index-based.

\`\`\`python
s = "Hello, World!"
print(s[0])
print(len(s))

print(s.lower())
print(s.upper())
print(s.replace('World', 'Python'))
print(s.find('World'))
print(s.split(','))
\`\`\`

### list
Lists are ordered and mutable.

\`\`\`python
lst = [1, 2, 3, "Python"]
lst.append(4)
lst[0] = 100
print(lst)
\`\`\`

### tuple
Tuples are ordered and immutable.

\`\`\`python
t = (1, 2, 3)
print(t[1])
\`\`\`

---

## Mapping Type: dict

\`\`\`python
d = {'name': 'Alice', 'age': 25}
print(d['name'])

print(d.keys())
print(d.values())
print(d.items())
print(d.get('age'))
d.update({'city': 'Hyderabad'})
print(d)
print(d.pop('age'))
\`\`\`

---

## Set Types

### set
\`\`\`python
s = {1, 2, 3, 3}
print(s)

s.add(4)
s.remove(2)

print(s.union({5, 6}))
print(s.intersection({1, 3, 5}))
print(s.difference({3}))
\`\`\`

### frozenset
\`\`\`python
fs = frozenset([1, 2, 3])
print(fs)
\`\`\`

---

## Boolean Type
\`\`\`python
x = True
y = False
print(type(x))
print(x and y)
print(x or y)
print(not x)
\`\`\`

---

## Binary Types

### bytes
\`\`\`python
b = b'hello'
print(b)
\`\`\`

### bytearray
\`\`\`python
ba = bytearray([65, 66, 67])
ba[0] = 68
print(ba)
\`\`\`

### memoryview
\`\`\`python
data = bytearray(b"hello")
mv = memoryview(data)
print(mv[0])
\`\`\`

---

## None Type
\`\`\`python
x = None
print(type(x))
\`\`\`

---

## Type Conversion
\`\`\`python
a = 5.6
print(int(a))      # 5

a = 5
print(float(a))    # 5.0

a = 5
print(complex(a))  # (5+0j)
\`\`\`

---

## String Slicing and Operators
\`\`\`python
s1 = 'TECHLEARN'
print(s1[:4])      # TECH
print(s1[-5:])     # LEARN

print('TECH' + 'LEARN')
print('TECH' * 3)

name = 'TechLearn'
mobile = 9676663136
print(f"Name is: {name} and Mobile is: {mobile}")
\`\`\`

---

## Common String Methods
| Method | Purpose |
|---|---|
| capitalize() | First letter uppercase |
| count(x) | Count substring |
| find(x) | Index or -1 |
| split(sep) | Split to list |
| index(x) | Like find() but error if missing |
| upper() | Uppercase |
| lower() | Lowercase |
| islower() | Check lowercase |
| isupper() | Check uppercase |
| isnumeric() | Check numeric |

Example:
\`\`\`python
names = "vnr-cmr-uoh-mahindra-cbit"
for name in names.split('-'):
    print(name.capitalize())
\`\`\`

---

## Common List Methods
| Method | Purpose |
|---|---|
| append(x) | Add to end |
| insert(i,x) | Insert at index |
| extend(list2) | Add multiple |
| remove(x) | Remove first match |
| pop() | Remove last |
| pop(i) | Remove index |
| clear() | Empty list |
| sort() | Sort ascending |
| reverse() | Reverse order |
| index(x) | Find index |
| count(x) | Count |
| copy() | Shallow copy |

---

## Tuple Basics
Tuples are immutable.

\`\`\`python
t = (10, 15, 20, 25)
z = (x for x in t if x <= 20)
for val in z:
    print(val, end=' ')
\`\`\`

Tuple methods:
- \`index(x)\`
- \`count(x)\`

---

## Set Summary
Set is unordered, unique values, no indexing.

Common operations:
- add(), update()
- union(|), intersection(&)
- difference(-), symmetric_difference(^)
- remove(), discard(), pop()
- issubset(<=), issuperset(>=), isdisjoint()

---

## Dictionary Methods (Quick)
- update(), setdefault()
- pop(), popitem()
- copy(), clear()
- get(), keys(), values(), items()
`,
    },
  ];

  for (let i = 0; i < topicsData.length; i++) {
    const item = topicsData[i];

    const topic = await prisma.topic.create({
      data: {
        courseId: course.id,
        title: item.title,
        order: i + 1,
      },
    });

    await prisma.note.create({
      data: {
        topicId: topic.id,
        content: item.content,
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("✅ Course ID:", course.id);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

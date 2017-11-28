arr = []

def type1(pool, string):
    count = 0
    length = len(string)
    slength = len(pool)

    for j in range(len(string)):
        temp = string[j: j + slength]
        count += temp.count(pool)    
    return count

def type2(pool,string):
    length = len(pool)
    slength = len(string)
    count = 0
    old = []
    s = []
    for i in range(length):
        temp = pool[:i] + pool[(i + 1):]
        if temp not in old:
            old.append(temp)
    for s in old:
        for j in range(slength):
            temp = string[j: j + len(s)]
            count += temp.count(s)
    return count

def type3(pool,string):
    length = len(pool)
    count = 0;
    old = []
    letters = ['G','A','C','T']
    for i in range(length):
        for letter in letters:
            temp = list(pool)
            temp.insert(i,letter)
            new_string = "".join(temp)
            if new_string not in old:
                old.append(new_string)
    
    for letter in letters:
        temp = list(pool)
        temp.append(letter)
        new_string = "".join(temp)
        if new_string not in old:
            old.append(new_string)
    
    for s in old:
        for i in range(len(string)):
            temp = string[i: i + len(s)]
            count += temp.count(s)

    return count
            

while True:
    sequence =  raw_input("")
    if sequence == "0":
        break
    else:
        arr.append(sequence)

for seq in arr:
    words = seq.split()
    print str(type1(words[0],words[1])) + " " + str(type2(words[0],words[1])) + " " + str(type3(words[0],words[1]))



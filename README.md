
      The Covid-19 pandemic has taught us many things. One among that is we should share our knowledge with the world 
      rather than it just being lost some day.


      This repo contains a LocalSQL Class for javascript which enables us to create a flexible, powerful and versatile mechanism 
      for  in-memory local sql.

      I would love everyone to use it, play with it and provide feedback.

 
 
      
      The SQL syntax is given as follows in BNF form :
      
             select 
      
             [all | distinct ]
        
             [ <selectitem> [as <columname> [ datatype:length:decimals |  objtemplate: <objecttemplate> | objclassname: <objectClassname> ] , .... | 
               count(*) | sum|avg|min|max( <selectitem> ) as <columname> [ datatype:length:decimals ] , ....]
     
             from <tablename> [ alias ], [<tablename> [ alias ], ....] 
     
             [join | joinfirst | leftjoin | leftjoinfirst | nomatch  <lhstablename|lhsaliasname>.(<lhskeylist>) == <rhstablename|rhsaliasname>.(<rhskeylist>),  ........] 
      
             [into <outputtable>]
      
             [where <anyvalidjscondition>]
       
             [groupby <outputcolname>, .....]
 
             [having <anyvalidjscondition>]
      
             [orderby <outputcolname> [asc|desc], .....]
      
             [limit <n>]
      
         
      Notes : 
            
           1. The "select" keyword is mandatory.
      
           2. The [all | distinct ] is optional. The default is all.
      
           3. The <selectitem> can be :
      
                   an unqualified Wildcard, example : * 
                                 Allowed only if one table is specified 
                                 Moreover, as clause is not allowed
      
                   a qualified Wildcard, example : custmst.*, a.* 
                                 However, as clause not allowed
                                 Note : if you select more than one table with a qualified wilcard, the field names
                                 across the two tables must be unique, else it will notify an error.
      
                   a specific Field, example : itemcd, a.custcd, b.invqty, custmst.limit, b.invdt as mydate 
                                 However, as clause is optional
                                 Also qualifier is optional if there is only one table in sql, else it is required
      
                   an Object , example : a.userinfo
                                 However, as clause is optional
                                 Also qualifier is optional if there is only one table in sql, else it is required
     
                   a Sub-Object , example : a.userinfo.address
                                 However, as clause is optional - if it is not given, then subobject name is taken as the 
                                 result column name.
                                 Also qualifier is optional if there is only one table in sql, else it is required
      
                   an Object Property, example  : a.userinfo.address.city 
                                 However, as clause is optional - if it is not given, then property name is taken as the 
                                 result column name.
                                 Also qualifier is optional if there is only one table in sql, else it is required
      
                   an Expression, example : a.custname.substr(0,15) as shortname 
                                 However, as clause must be given
                                 Also qualifier is optional if there is only one table in sql, else it is required
      
                   a Constant , examples  : "A001" as custcd, 0.00 as amt , {x:1,y:2} as myobj
                                 However,  as clause must be given
       
                   Data Aggregation Operator such as (sum, avg, min, max, count) 
                                 Examples : sum(b.value) as totval, count(*) as totrecs 
                                 However,  as clause must be given
                                 Moreover, count must be specified as count(*)
      
                                 The sql operator must be used in conjuction with a groupby clause. 
                                 If we want to use a sql operator on whole table, we can inject a dummy field
                                 with constant value as another select item and specify that dummy field in 
                                 groupby clause.
      
            
           4. A Field in <selectitem> must be qualified if there are more than one table in the sql. The qualifier can 
              be either table name or table alias.
                 
              Moreover, a <selectitem> must not be a reserved sql key word such as "select", "all", "distinct", "from", 
              "join" etc.  
      
              At least one <selectitem> must be specified in sql. However, if there is only one table and this clause
              is ommitted the default is taken as * - ie, all fields 
              
           5. A <selectitem> can have an associated "as" clause - except where <selectitem> is a wildcard. 
              It is mandatory if <selectitem> is a "Constant", an "Expression" or a "Data Aggregation Operator" 
      
           6. The "as" clause can have an optional Data Descriptor or Object Descriptor.
      
           7. The Data Descriptor has a form datatype:length:decimals. The DataType can be N|C|D|L ;
              N - for Numeric, C - for character strings , D - for Date Strings, L- for logical value.
              
              If the <selectitem> refers to a table field, these properties are automatically inherited by
              SQL engine from the data structure of the table. If the <selectitem> is a Constant,an Expression or
              a Data Aggregation Operator, these properties are inferred by SQL Engine.  Please note that for
              Data Aggregation Operators, the data size is taken as 2 digits more than that of the Expression.  
              Therefore, the developer may wish to explicitly state these attributes where <selectitem> is a
              "Constant", an "Expression" or a "Data Aggregation Operator".
              
              If a Data Descriptor attribute is specified, it will always override the properties inherited from
              Data structure of tables or inferred by the SQL.
            
           8. The Object Descriptor has two forms :
      
              a) Object Template Specs -  objtemplate: <objecttemplate> 
                 Example - objtemplate:{address:{line1:"",line2:"",city:"", pin:000000},taxregno:"",creditlimit:0}
      
              b) Object Class Specs    -  objclassname: <objectClassname>
                 Example -   objclassname:"Circle"

      
              If the <selectitem> is a wildcard, and that table contains any object type field, the Object Descriptor
              properties are automatically inherited by the SQL engine from the data structure of the table.  
     
              If the <selectitem> refers to an Object datatype field in its source table, the Object Descriptor
              properties are automatically inherited by the SQL engine from the data structure of the table.
        
              Moreover, if the <selectitem> refers to a subobject of an Object datatype field, the Object Descriptor
              properties are also automatically inherited by the SQL engine from the data structure of the table.
      
              However, if the <selectitem> refers to a property of an Object datatype field, its properties are
              inferred by SQL Engine as javascript objects do not carry explicit information on datatype and size. 
              In such a case, the developer may explicitly state the properties using the data descriptor attributes
              in the form datatype:length:decimals.
      
              If the <selectitem> is an Object Constant (for example : {x:1,y:2} as myobj ), the developer can explicitly
              specify its Object Template Specs or Object Class Specs. If a Object Class Specs are specified, the Object
              will be converted from the plain object to class object by SQL Engine. However, if an Object Descriptor is 
              not specified, the given Object Constant is itself taken as Object Template.
      
              If the <selectitem> is a Table field which contains a JSON String (for example : '{"x":1,"y":2}' ) ;
              the developer can explicitly convert it to a plain object or a class object by specifying the Object Descriptor
              - i.e. Object Template Specs or Object Class Specs.  However, if an Object Descriptor is not specified, the 
              JSON string of the <selectitem> will be treated as a plain string.
      
      
           9. The "from" clause is mandatory. It must have at least one <tablename>. We can also optionally specify an
              alias for each table. The alias names, if specified, must be unique.
             
              If there are multiple tables, the order in which they are specified is important. The first
              table specified in "from" clause is primary or driver table of the SQL.
        
       
          10. If the "from" clause contains more than one table, they must be joined by specifying join conditions.
              The join condition has a special syntax rather than being part of where condition.
               
              The Primary table (i.e. first table in the from clause) can be joined to any number of other tables, 
              which may be called "Secondary Tables". All these joins are Level-1  Joins. However, only one of
              these Level-1 joins from Primary to Secondary Table can be a join or left join - which can potentially 
              result in one to multi mapping. Other Joins must be only joinfirst, leftjoinfirst or nomatch. 
        
              Any of the "Secondary Table" may be joined with any number of other tables, which may be called
              "Tertiary Tables". All these joins are Level-2 joins, which must be only joinfirst, leftjoinfirst or nomatch.
              
              Any of the "Tertiary Table" may be joined with any number of other tables, which may be called
              "Fourth Level Tables". All these joins are Level-3 joins, which must be only joinfirst, leftjoinfirst or nomatch.
              
              It should be noted that one table can not be used more than once as RHS in any join condition.
      
              The join system provided in LocalSql is designed to provide very deep functionality with crystal
              clear and unambiguous syntax, while providing very high degree of join efficiency.   
               
          11. An explantion of various join types is as follows :
      
               Type          Explanation
       
               join          1 : n match  -    if RHS table has a match, one or more records will be outputted depending on
                                               the number of matched records in RHS table. 
                                               However, no record will be selected if no match is found in RHS table. 
                                               This is the standard ansi sql join.
     
               joinfirst     1 : 1 match  -    if RHS table has a match, only the first matching record will be considered ;
                                               and thus only one record will be outputted.
                                               This is our optimisation technique to instruct SQL engine to stop looking
                                               for more matching records, once one record is matched.
                                               However, no record will be selected if no match is found in RHS table. 
          
      
               leftjoin      1 : 0|n match -   if RHS table has a match, one or more records will be outputted depending on
                                               the number of matched records in RHS table. 
                                               However, if no match is found in RHS table, only the first record from LHS table
                                               will be outputted. This is the standard ansi sql left-join.
     
     
               leftjoinfirst  1 : 0|1 match -  if RHS table has a match, only the first matching record will be considered ;
                                               and thus only one record will be outputted.
                                               This is our optimisation technique to instruct SQL engine to stop looking
                                               for more matching records, once one record is matched.
                                               However, if no match is found in RHS table, only the first record from LHS table
                                               will be outputted. 
      
               nomatch       1 : 0   match   - if RHS table has no matching records, then the first record from LHS table will
                                               will outputted. If there is a match, the matching records from LHS table will 
                                               be dropped. This is similar to NOT IN clause of SQL - expressed in our new join
                                               syntax.   
     
          12. The join condition has a special syntax.  Some examples are as follows :
               
              join table1.(k1) == table2.(k1)
              join table1.(k1,k2) == table2.(k1,k2)             
              join alias1.(k1) == alias2.(k1)
              join alias1.(k1,k2) == alias2.(k1,k2)             
      
      
          13. if [into <outputtable>] clause is not specified, the output table is still available to caller in localsqlobject._resultcursor
     
      
          14. The elements of "Where condition" must be qualified with either source table name or source table alias.
              However, if there is only one table specified in from clause, the qualifier is optional. The "where
              condition" must be a valid JS logical expression - which must evaluate to true or false. 
          
          15. The elements of groupby must not be qualified. It must contain only output column names without any
              qualifiers.  
      
          16. The elements of "Having condition" must not be qualified. It must contain only output column names 
              without any qualifiers. The "Having condition" must be a valid JS logical expression - which must evaluate
              to true or false. The "Having condition" is applied after data has been grouped using the specified
              groupby clause.
       
          17. The elements of "orderby" must not be qualified. It must contain only output column names 
              without any qualifiers. Each of these columns may be sorted in Ascending or Descending Sequence.
              The "orderby" is applied after data has been grouped and then filtered by applying "having" condition.
      
      
          18. The SQL keywords must be specified in the same sequence as specified in the BNF syntax. 
      

     Usage Examples :
      
      var _oSql, _oTempTbl, _lResult ;
     
      // select unqualified wildcard - without into clause
      _oSql = new LocalSql("select all * from invitbt a orderby itemcd desc, qty asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      } else {
         mylib.showError("error in executing SQL") ;
         return ;
      }
      
        
      // select unqualified wildcard - using into clause
      appenv.mycursor = new LocalTable();
      _oSql = new LocalSql("select all * from invitbt a into mycursor orderby itemcd desc, qty asc limit 10", appenv);
      _lResult = _oSql.runSql();
      if (! _lResult) {
         mylib.showError("error in executing SQL") ;
         return ;
      }
     
      
      // select qualified wildcard 
      _oSql = new LocalSql("select a.* from invitbt a orderby itemcd desc, qty asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
     
     
      // select with specific fields and objects
      _oSql = new LocalSql("select dist itemcd,  itemdes,qty as myqty, userinfo from invitbt a where a.qty > 0 orderby itemcd desc, myqty asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
     
      // select with specific fields and  constants
      _oSql = new LocalSql("select dist itemcd, itemdes , qty, 'a001' as mystr, 123.45 as value N:14:5 , true as myBool, {x:1,y:2} as myobj from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      } 
     
      
      // select with specific fields and expressions
      _oSql = new LocalSql("select dist itemcd, itemdes , qty, a.recno() as seq, (qty > 100 ? qty : 0) as myqty from invitbt a where a.qty > 1 orderby itemcd desc, itemdes asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
     
      
      // select with specific fields, object, subobject and object property
      _oSql = new LocalSql("select dist itemcd, itemdes , qty, userinfo, userinfo.address, userinfo.address.city as mycity C:25 from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
     
      
      // select with objtemplate and objclassname 
      _oSql = new LocalSql("select itemcd, itemdes , qty,  itemstr3 as itemobj objtemplate:{point:{x:0,y:0}, r:0} , itemstr4 as itemclassobj objclassname:appClasses.Circle,  mycircle  from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
      
     
     
      // select with data aggregation operators and group by
      _oSql = new LocalSql("select itemcd, itemdes , count(*) as mycount,  sum(qty) as ytdqty, avg(qty) as avgqty , max(qty) as maxqty, min(qty) as minqty from invitbt a where a.qty > 1 groupby itemcd orderby itemcd desc, minqty asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
     
      
      // select with special facility to output data aggregation operators on an expr as object property (used in 3D SQL) 
      _oSql = new LocalSql("select itemcd, itemdes , qty, {mycount: 0, ytdqty1: 0, ytdqty2:0, avgqty : 0, minqty:0, maxqty:0, } as myobj, count(*) as myobj.mycount X, avg(qty) as myobj.avgqty X, min(qty) as myobj.minqty X, max(qty) as myobj.maxqty X, sum(qty < 100 ? qty : 0) as myobj.ytdqty1 X, sum(qty > 100 ? qty : 0) as myobj.ytdqty2 X from invitbt a where a.qty > 1 groupby itemcd orderby itemcd desc, qty asc limit 10", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
          _oTempTbl = _oSql._resultcursor ;
      }
     
      // select with leftjoin
      _oSql = new LocalSql("select a.itemcd,  a.qty  from invitbt a, itemmst b  leftjoin a.(itemcd) == b.(itemcd) ", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
      
     
      // select with leftjoin and joinfirst
      _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  leftjoin a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
          _oTempTbl = _oSql._resultcursor ;
      }
     
     
      // select with join and joinfirst
      _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  join a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
      
       
      // select with joinfirst and joinfirst
      _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  joinfirst a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
     
      // select with nomatch
      _oSql = new LocalSql("select a.itemcd, a.qty  from invitbt a, itemmst b  nomatch a.(itemcd) == b.(itemcd) " , appenv);
      _oTempTbl = new LocalTable() ;
      _lResult = _oSql.runSql();
      if (_lResult) {
         _oTempTbl = _oSql._resultcursor ;
      }
 
 
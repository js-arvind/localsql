
"use strict";


(function( context ) {


    /**
     * @fileOverview  LocalSql Class 
     * 
     * We create a flexible, powerful and versatile mechanism for in-memory local sql.
     *   
     * @author Arvind Kumar Kejriwal 
     * @copyright (c) 2018-2019 Progen Software
     * @version 1.0
     * 
     *     
     * @example
     * 
     * var _oSql, _oTempTbl, _lResult ;
     *
     * // select unqualified wildcard - without into clause
     * _oSql = new LocalSql("select all * from invitbt a orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * } else {
     *    mylib.showError("error in executing SQL") ;
     *    return ;
     * }
     * 
     *   
     * // select unqualified wildcard - using into clause
     * appenv.mycursor = new LocalTable();
     * _oSql = new LocalSql("select all * from invitbt a into mycursor orderby itemcd desc, qty asc limit 10", appenv);
     * _lResult = _oSql.runSql();
     * if (! _lResult) {
     *    mylib.showError("error in executing SQL") ;
     *    return ;
     * }
     *
     * 
     * // select qualified wildcard 
     * _oSql = new LocalSql("select a.* from invitbt a orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     *
     * // select with specific fields and objects
     * _oSql = new LocalSql("select dist itemcd,  itemdes,qty as myqty, userinfo from invitbt a where a.qty > 0 orderby itemcd desc, myqty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * // select with specific fields and  constants
     * _oSql = new LocalSql("select dist itemcd, itemdes , qty, 'a001' as mystr, 123.45 as value N:14:5 , true as myBool, {x:1,y:2} as myobj from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * } 
     *
     * 
     * // select with specific fields and expressions
     * _oSql = new LocalSql("select dist itemcd, itemdes , qty, a.recno() as seq, (qty > 100 ? qty : 0) as myqty from invitbt a where a.qty > 1 orderby itemcd desc, itemdes asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * 
     * // select with specific fields, object, subobject and object property
     * _oSql = new LocalSql("select dist itemcd, itemdes , qty, userinfo, userinfo.address, userinfo.address.city as mycity C:25 from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * 
     * // select with objtemplate and objclassname 
     * _oSql = new LocalSql("select itemcd, itemdes , qty,  itemstr3 as itemobj objtemplate:{point:{x:0,y:0}, r:0} , itemstr4 as itemclassobj objclassname:appClasses.Circle,  mycircle  from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     * 
     *
     *
     * // select with data aggregation operators and group by
     * _oSql = new LocalSql("select itemcd, itemdes , count(*) as mycount,  sum(qty) as ytdqty, avg(qty) as avgqty , max(qty) as maxqty, min(qty) as minqty from invitbt a where a.qty > 1 groupby itemcd orderby itemcd desc, minqty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * 
     * // select with special facility to output data aggregation operators on an expr as object property (used in 3D SQL) 
     * _oSql = new LocalSql("select itemcd, itemdes , qty, {mycount: 0, ytdqty1: 0, ytdqty2:0, avgqty : 0, minqty:0, maxqty:0, } as myobj, count(*) as myobj.mycount X, avg(qty) as myobj.avgqty X, min(qty) as myobj.minqty X, max(qty) as myobj.maxqty X, sum(qty < 100 ? qty : 0) as myobj.ytdqty1 X, sum(qty > 100 ? qty : 0) as myobj.ytdqty2 X from invitbt a where a.qty > 1 groupby itemcd orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *     _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * // select with leftjoin
     * _oSql = new LocalSql("select a.itemcd,  a.qty  from invitbt a, itemmst b  leftjoin a.(itemcd) == b.(itemcd) ", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     * 
     *
     * // select with leftjoin and joinfirst
     * _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  leftjoin a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *     _oTempTbl = _oSql._resultcursor ;
     * }
     *
     *
     * // select with join and joinfirst
     * _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  join a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     * 
     *  
     * // select with joinfirst and joinfirst
     * _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  joinfirst a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * // select with nomatch
     * _oSql = new LocalSql("select a.itemcd, a.qty  from invitbt a, itemmst b  nomatch a.(itemcd) == b.(itemcd) " , appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     *
     *
     */


  
  
 
    
    /**
     * Creates a new LocalSql object with specified Sql and parses it, validates it and prepares it for fast execution.
     *  
     * 
     * @constructor
     * 
     * @param {string} _cSql An Sql which is run on a set of local tables and gives another local table as output.
     * 
     * The SQL syntax is given as follows in BNF form :
     * 
     *        select 
     * 
     *        [all | distinct ]
     *   
     *        [ <selectitem> [as <columname> [ datatype:length:decimals |  objtemplate: <objecttemplate> | objclassname: <objectClassname> ] , .... | 
     *          count(*) | sum|avg|min|max( <selectitem> ) as <columname> [ datatype:length:decimals ] , ....]
     *
     *        from <tablename> [ alias ], [<tablename> [ alias ], ....] 
     *
     *        [join | joinfirst | leftjoin | leftjoinfirst | nomatch  <lhstablename|lhsaliasname>.(<lhskeylist>) == <rhstablename|rhsaliasname>.(<rhskeylist>),  ........] 
     * 
     *        [into <outputtable>]
     * 
     *        [where <anyvalidjscondition>]
     *  
     *        [groupby <outputcolname>, .....]
     * 
     *        [having <anyvalidjscondition>]
     * 
     *        [orderby <outputcolname> [asc|desc], .....]
     * 
     *        [limit <n>]
     * 
     *    
     * Notes : 
     *       
     *      1. The "select" keyword is mandatory.
     * 
     *      2. The [all | distinct ] is optional. The default is all.
     * 
     *      3. The <selectitem> can be :
     * 
     *              an unqualified Wildcard, example : * 
     *                            Allowed only if one table is specified 
     *                            Moreover, as clause is not allowed
     * 
     *              a qualified Wildcard, example : custmst.*, a.* 
     *                            However, as clause not allowed
     *                            Note : if you select more than one table with a qualified wilcard, the field names
     *                            across the two tables must be unique, else it will notify an error.
     * 
     *              a specific Field, example : itemcd, a.custcd, b.invqty, custmst.limit, b.invdt as mydate 
     *                            However, as clause is optional
     *                            Also qualifier is optional if there is only one table in sql, else it is required
     * 
     *              an Object , example : a.userinfo
     *                            However, as clause is optional
     *                            Also qualifier is optional if there is only one table in sql, else it is required
     *
     *              a Sub-Object , example : a.userinfo.address
     *                            However, as clause is optional - if it is not given, then subobject name is taken as the 
     *                            result column name.
     *                            Also qualifier is optional if there is only one table in sql, else it is required
     * 
     *              an Object Property, example  : a.userinfo.address.city 
     *                            However, as clause is optional - if it is not given, then property name is taken as the 
     *                            result column name.
     *                            Also qualifier is optional if there is only one table in sql, else it is required
     * 
     *              an Expression, example : a.custname.substr(0,15) as shortname 
     *                            However, as clause must be given
     *                            Also qualifier is optional if there is only one table in sql, else it is required
     * 
     *              a Constant , examples  : "A001" as custcd, 0.00 as amt , {x:1,y:2} as myobj
     *                            However,  as clause must be given
     *  
     *              Data Aggregation Operator such as (sum, avg, min, max, count) 
     *                            Examples : sum(b.value) as totval, count(*) as totrecs 
     *                            However,  as clause must be given
     *                            Moreover, count must be specified as count(*)
     * 
     *                            The sql operator must be used in conjuction with a groupby clause. 
     *                            If we want to use a sql operator on whole table, we can inject a dummy field
     *                            with constant value as another select item and specify that dummy field in 
     *                            groupby clause.
     * 
     *       
     *      4. A Field in <selectitem> must be qualified if there are more than one table in the sql. The qualifier can 
     *         be either table name or table alias.
     *            
     *         Moreover, a <selectitem> must not be a reserved sql key word such as "select", "all", "distinct", "from", 
     *         "join" etc.  
     * 
     *         At least one <selectitem> must be specified in sql. However, if there is only one table and this clause
     *         is ommitted the default is taken as * - ie, all fields 
     *         
     *      5. A <selectitem> can have an associated "as" clause - except where <selectitem> is a wildcard. 
     *         It is mandatory if <selectitem> is a "Constant", an "Expression" or a "Data Aggregation Operator" 
     * 
     *      6. The "as" clause can have an optional Data Descriptor or Object Descriptor.
     * 
     *      7. The Data Descriptor has a form datatype:length:decimals. The DataType can be N|C|D|L ;
     *         N - for Numeric, C - for character strings , D - for Date Strings, L- for logical value.
     *         
     *         If the <selectitem> refers to a table field, these properties are automatically inherited by
     *         SQL engine from the data structure of the table. If the <selectitem> is a Constant,an Expression or
     *         a Data Aggregation Operator, these properties are inferred by SQL Engine.  Please note that for
     *         Data Aggregation Operators, the data size is taken as 2 digits more than that of the Expression.  
     *         Therefore, the developer may wish to explicitly state these attributes where <selectitem> is a
     *         "Constant", an "Expression" or a "Data Aggregation Operator".
     *         
     *         If a Data Descriptor attribute is specified, it will always override the properties inherited from
     *         Data structure of tables or inferred by the SQL.
     *       
     *      8. The Object Descriptor has two forms :
     * 
     *         a) Object Template Specs -  objtemplate: <objecttemplate> 
     *            Example - objtemplate:{address:{line1:"",line2:"",city:"", pin:000000},taxregno:"",creditlimit:0}
     * 
     *         b) Object Class Specs    -  objclassname: <objectClassname>
     *            Example -   objclassname:"Circle"

     * 
     *         If the <selectitem> is a wildcard, and that table contains any object type field, the Object Descriptor
     *         properties are automatically inherited by the SQL engine from the data structure of the table.  
     *
     *         If the <selectitem> refers to an Object datatype field in its source table, the Object Descriptor
     *         properties are automatically inherited by the SQL engine from the data structure of the table.
     *   
     *         Moreover, if the <selectitem> refers to a subobject of an Object datatype field, the Object Descriptor
     *         properties are also automatically inherited by the SQL engine from the data structure of the table.
     * 
     *         However, if the <selectitem> refers to a property of an Object datatype field, its properties are
     *         inferred by SQL Engine as javascript objects do not carry explicit information on datatype and size. 
     *         In such a case, the developer may explicitly state the properties using the data descriptor attributes
     *         in the form datatype:length:decimals.
     * 
     *         If the <selectitem> is an Object Constant (for example : {x:1,y:2} as myobj ), the developer can explicitly
     *         specify its Object Template Specs or Object Class Specs. If a Object Class Specs are specified, the Object
     *         will be converted from the plain object to class object by SQL Engine. However, if an Object Descriptor is 
     *         not specified, the given Object Constant is itself taken as Object Template.
     * 
     *         If the <selectitem> is a Table field which contains a JSON String (for example : '{"x":1,"y":2}' ) ;
     *         the developer can explicitly convert it to a plain object or a class object by specifying the Object Descriptor
     *         - i.e. Object Template Specs or Object Class Specs.  However, if an Object Descriptor is not specified, the 
     *         JSON string of the <selectitem> will be treated as a plain string.
     * 
     * 
     *      9. The "from" clause is mandatory. It must have at least one <tablename>. We can also optionally specify an
     *         alias for each table. The alias names, if specified, must be unique.
     *        
     *         If there are multiple tables, the order in which they are specified is important. The first
     *         table specified in "from" clause is primary or driver table of the SQL.
     *   
     *  
     *     10. If the "from" clause contains more than one table, they must be joined by specifying join conditions.
     *         The join condition has a special syntax rather than being part of where condition.
     *          
     *         The Primary table (i.e. first table in the from clause) can be joined to any number of other tables, 
     *         which may be called "Secondary Tables". All these joins are Level-1  Joins. However, only one of
     *         these Level-1 joins from Primary to Secondary Table can be a join or left join - which can potentially 
     *         result in one to multi mapping. Other Joins must be only joinfirst, leftjoinfirst or nomatch. 
     *   
     *         Any of the "Secondary Table" may be joined with any number of other tables, which may be called
     *         "Tertiary Tables". All these joins are Level-2 joins, which must be only joinfirst, leftjoinfirst or nomatch.
     *         
     *         Any of the "Tertiary Table" may be joined with any number of other tables, which may be called
     *         "Fourth Level Tables". All these joins are Level-3 joins, which must be only joinfirst, leftjoinfirst or nomatch.
     *         
     *         It should be noted that one table can not be used more than once as RHS in any join condition.
     * 
     *         The join system provided in LocalSql is designed to provide very deep functionality with crystal
     *         clear and unambiguous syntax, while providing very high degree of join efficiency.   
     *          
     *     11. An explantion of various join types is as follows :
     * 
     *          Type          Explanation
     *  
     *          join          1 : n match  -    if RHS table has a match, one or more records will be outputted depending on
     *                                          the number of matched records in RHS table. 
     *                                          However, no record will be selected if no match is found in RHS table. 
     *                                          This is the standard ansi sql join.
     *
     *          joinfirst     1 : 1 match  -    if RHS table has a match, only the first matching record will be considered ;
     *                                          and thus only one record will be outputted.
     *                                          This is our optimisation technique to instruct SQL engine to stop looking
     *                                          for more matching records, once one record is matched.
     *                                          However, no record will be selected if no match is found in RHS table. 
     *     
     * 
     *          leftjoin      1 : 0|n match -   if RHS table has a match, one or more records will be outputted depending on
     *                                          the number of matched records in RHS table. 
     *                                          However, if no match is found in RHS table, only the first record from LHS table
     *                                          will be outputted. This is the standard ansi sql left-join.
     *
     *
     *          leftjoinfirst  1 : 0|1 match -  if RHS table has a match, only the first matching record will be considered ;
     *                                          and thus only one record will be outputted.
     *                                          This is our optimisation technique to instruct SQL engine to stop looking
     *                                          for more matching records, once one record is matched.
     *                                          However, if no match is found in RHS table, only the first record from LHS table
     *                                          will be outputted. 
     * 
     *          nomatch       1 : 0   match   - if RHS table has no matching records, then the first record from LHS table will
     *                                          will outputted. If there is a match, the matching records from LHS table will 
     *                                          be dropped. This is similar to NOT IN clause of SQL - expressed in our new join
     *                                          syntax.   
     *
     *     12. The join condition has a special syntax.  Some examples are as follows :
     *          
     *         join table1.(k1) == table2.(k1)
     *         join table1.(k1,k2) == table2.(k1,k2)             
     *         join alias1.(k1) == alias2.(k1)
     *         join alias1.(k1,k2) == alias2.(k1,k2)             
     * 
     * 
     *     13. if [into <outputtable>] clause is not specified, the output table is still available to caller in localsqlobject._resultcursor
     *
     * 
     *     14. The elements of "Where condition" must be qualified with either source table name or source table alias.
     *         However, if there is only one table specified in from clause, the qualifier is optional. The "where
     *         condition" must be a valid JS logical expression - which must evaluate to true or false. 
     *     
     *     15. The elements of groupby must not be qualified. It must contain only output column names without any
     *         qualifiers.  
     * 
     *     16. The elements of "Having condition" must not be qualified. It must contain only output column names 
     *         without any qualifiers. The "Having condition" must be a valid JS logical expression - which must evaluate
     *         to true or false. The "Having condition" is applied after data has been grouped using the specified
     *         groupby clause.
     *  
     *     17. The elements of "orderby" must not be qualified. It must contain only output column names 
     *         without any qualifiers. Each of these columns may be sorted in Ascending or Descending Sequence.
     *         The "orderby" is applied after data has been grouped and then filtered by applying "having" condition.
     * 
     * 
     *     18. The SQL keywords must be specified in the same sequence as specified in the BNF syntax. 
     * 
     * 
     * @param {object} _oTablesScope  The scope object which contains all the input tables as well as output table 
     *
     *  
     * @returns {object} The localsql object
     * 
     * @example 
     * 
     * 
     * var _oSql, _oTempTbl, _lResult ;
     *
     * // select unqualified wildcard - without into clause
     * _oSql = new LocalSql("select all * from invitbt a orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * } else {
     *    mylib.showError("error in executing SQL") ;
     *    return ;
     * }
     * 
     *   
     * // select unqualified wildcard - using into clause
     * appenv.mycursor = new LocalTable();
     * _oSql = new LocalSql("select all * from invitbt a into mycursor orderby itemcd desc, qty asc limit 10", appenv);
     * _lResult = _oSql.runSql();
     * if (! _lResult) {
     *    mylib.showError("error in executing SQL") ;
     *    return ;
     * }
     * 
     * // select qualified wildcard 
     * _oSql = new LocalSql("select a.* from invitbt a orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     *
     * // select with specific fields and objects
     * _oSql = new LocalSql("select dist itemcd,  itemdes,qty as myqty, userinfo from invitbt a where a.qty > 0 orderby itemcd desc, myqty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * // select with specific fields and  constants
     * _oSql = new LocalSql("select dist itemcd, itemdes , qty, 'a001' as mystr, 123.45 as value N:14:5 , true as myBool, {x:1,y:2} as myobj from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * } 
     *
     * 
     * // select with specific fields and expressions
     * _oSql = new LocalSql("select dist itemcd, itemdes , qty, a.recno() as seq, (qty > 100 ? qty : 0) as myqty from invitbt a where a.qty > 1 orderby itemcd desc, itemdes asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * 
     * // select with specific fields, object, subobject and object property
     * _oSql = new LocalSql("select dist itemcd, itemdes , qty, userinfo, userinfo.address, userinfo.address.city as mycity C:25 from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * 
     * // select with objtemplate and objclassname 
     * _oSql = new LocalSql("select itemcd, itemdes , qty,  itemstr3 as itemobj objtemplate:{point:{x:0,y:0}, r:0} , itemstr4 as itemclassobj objclassname:appClasses.Circle,  mycircle  from invitbt a where a.qty > 1 orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     * 
     *
     *
     * // select with data aggregation operators and group by
     * _oSql = new LocalSql("select itemcd, itemdes , count(*) as mycount,  sum(qty) as ytdqty, avg(qty) as avgqty , max(qty) as maxqty, min(qty) as minqty from invitbt a where a.qty > 1 groupby itemcd orderby itemcd desc, minqty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * 
     * // select with special facility to output data aggregation operators on an expr as object property (used in 3D SQL) 
     * _oSql = new LocalSql("select itemcd, itemdes , qty, {mycount: 0, ytdqty1: 0, ytdqty2:0, avgqty : 0, minqty:0, maxqty:0, } as myobj, count(*) as myobj.mycount X, avg(qty) as myobj.avgqty X, min(qty) as myobj.minqty X, max(qty) as myobj.maxqty X, sum(qty < 100 ? qty : 0) as myobj.ytdqty1 X, sum(qty > 100 ? qty : 0) as myobj.ytdqty2 X from invitbt a where a.qty > 1 groupby itemcd orderby itemcd desc, qty asc limit 10", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *     _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * // select with leftjoin
     * _oSql = new LocalSql("select a.itemcd,  a.qty  from invitbt a, itemmst b  leftjoin a.(itemcd) == b.(itemcd) ", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     * 
     *
     * // select with leftjoin and joinfirst
     * _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  leftjoin a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *     _oTempTbl = _oSql._resultcursor ;
     * }
     *
     *
     * // select with join and joinfirst
     * _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  join a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     * 
     *  
     * // select with joinfirst and joinfirst
     * _oSql = new LocalSql("select a.itemcd, c.itemdes, a.qty  from invitbt a, itemmst b, itemmstx c  joinfirst a.(itemcd) == b.(itemcd) joinfirst b.(itemcd) == c.(itemcd)", appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * // select with nomatch
     * _oSql = new LocalSql("select a.itemcd, a.qty  from invitbt a, itemmst b  nomatch a.(itemcd) == b.(itemcd) " , appenv);
     * _oTempTbl = new LocalTable() ;
     * _lResult = _oSql.runSql();
     * if (_lResult) {
     *    _oTempTbl = _oSql._resultcursor ;
     * }
     *
     * 
     */
   
    var LocalSql = function (_cSql, _oTablesScope) {
        // Should we _cSql make lowercase ?
        // NO - expressions may not work then !! 
    

        if (_cSql==undefined) {
            _cSql = ""; 
        }

        if (_cSql=="") {
            mylib.showError("sql not specified"); 
            return null; 
        }
        
        if (typeof _oTablesScope !== "object") {
            mylib.showError("TablesScope not specified"); 
            return null; 
        }

        // Remove multi spaces in sql except in string literals
        _cSql = mylib.StrRemMultiSpaces(_cSql);
        this._sql = _cSql;
        
        //this._oTablesScope = _oTablesScope ;
        // clone _oTablesScope , so that we can add alias tables to it later without disturbing original _oTablesScope
        this._oTablesScope = {};
        let _cPropId = null;
        for (_cPropId in _oTablesScope) {
            this._oTablesScope[_cPropId]  = _oTablesScope[_cPropId];
        }
        

        this._distinct = false;

        this._fldslist  = "";
        this._afldsobj = [];
        this._afldsobj[0] = {fldexpr:"",sqlop:"",fieldname:"",datatype:"",len:10,dec:0,objtemplate:"",objclassname:"",evalfx:null};

        this._tableslist = "";
        this._tablescount = 0;
        this._atablesobj = [];
        this._atablesobj[0] = {tablename:"",aliasname:"",tableobject:null};
        
        this._joinscount = 0;
        this._ajoinsobj  = [] ;
        this._ajoinsobj[0] = {jointype:"",joincond:"",lhsalias:"",lhskeylist:"",rhsalias:"",rhskeylist:"",lhsseq:0,rhsseq:0,joingraphlevel:0,rhsfurtherjoin:false, rhskeyexp : "",rhskeyevalfx: null, lhsvalueexp : "", lhsevalfx:null};

        this._selectinto  = "";

        this._wherecond  = "";
        this._whereevalfx = null;
        
        this._groupbylist = "";

        this._havingcond = "";

        this._orderbylist = "";
        this._orderbycount = 0;
        this._aorderbyobj = [];
        this._aorderbyobj[0] = {orderbycolname:"", orderbydesc : false};

        this._limit        = -1;

        this._resultcursor = ""; 
        this._defineerror  = false;
        this._runerror  = false;


        //Let's first re-fit the sql string  
        //1. normalise case of keywords to lower
        //2. combine certain keywords into one such such left join, order by, group by 
        _cSql = mylib.strtran(_cSql,"select ","select ", true);
        _cSql = mylib.strtran(_cSql," all "," all ", true);
        _cSql = mylib.strtran(_cSql," dist "," distinct ", true);
        _cSql = mylib.strtran(_cSql," distinct "," distinct ", true);
        _cSql = mylib.strtran(_cSql," from "," from ", true);
        _cSql = mylib.strtran(_cSql," join "," ansijoin ", true);
        _cSql = mylib.strtran(_cSql," joinfirst "," perpjoin ", true);
        _cSql = mylib.strtran(_cSql," leftjoin "," leftansijoin ", true);
        _cSql = mylib.strtran(_cSql," left join "," leftansijoin ", true);
        _cSql = mylib.strtran(_cSql," leftjoinfirst "," leftperpjoin ", true);
        _cSql = mylib.strtran(_cSql," left joinfirst "," leftperpjoin ", true);
        _cSql = mylib.strtran(_cSql," nomatch "," nomatch ", true);
        _cSql = mylib.strtran(_cSql," no match "," nomatch ", true);
        
        _cSql = mylib.strtran(_cSql," into "," into ", true);
        _cSql = mylib.strtran(_cSql," where "," where ", true);
        _cSql = mylib.strtran(_cSql," group by "," groupby ", true);
        _cSql = mylib.strtran(_cSql," order by "," orderby ", true);
        _cSql = mylib.strtran(_cSql," limit "," limit ", true);
        _cSql = mylib.strtran(_cSql," as "," as ", true);

        _cSql = mylib.strtran(_cSql,"sum(","sum(", true);
        _cSql = mylib.strtran(_cSql,"sum (","sum(", true);

        _cSql = mylib.strtran(_cSql,"avg(","avg(", true);
        _cSql = mylib.strtran(_cSql,"avg (","avg(", true);

        _cSql = mylib.strtran(_cSql,"min(","min(", true);
        _cSql = mylib.strtran(_cSql,"min (","min(", true);

        _cSql = mylib.strtran(_cSql,"max(","max(", true);
        _cSql = mylib.strtran(_cSql,"max (","max(", true);

        _cSql = mylib.strtran(_cSql,"count(","count(", true);
        _cSql = mylib.strtran(_cSql,"count (","count(", true);

        // Parse sql into main componnents
        // split into an array of tokens
        const _aTokens = _cSql.split(" ");
        const _nArrLen  = _aTokens.length ;
        
        // we have already removed multi spaces in sql except in string literals by using mylib.StrRemMultiSpaces(_cSql);
        // So, we must not remove null elements , bcuz then a string constant such as "A001  " will get converted to "A001"

        let _cToken = "";
        let _cLastKeyWord  = "";
        let _nCtr = 0;
        for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
            _cToken = _aTokens[_nCtr];

            // Note : though we move through each token in this loop, we have logic at several places below 
            //        which can further move forward through tokens in their inner loops.
            //        There, we use and increment the same _nCtr variable.

            if (_nCtr == 0) {
                if (_cToken == "select" ) {
                    _cLastKeyWord = _cToken ;  
                    continue;
                } else {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax: select key word not specified in sql"); 
                    break;
                }  
            }

            if (_nCtr == 1) {
                if (_cToken == "distinct" ) {
                    _cLastKeyWord = _cToken ;  
                    this._distinct  = true;
                    continue;
                }  
            }

            if (_nCtr == 1) {
                if (_cToken == "all" ) {
                    _cLastKeyWord = _cToken ; 
                    continue; 
                }  
            }


            if (_cLastKeyWord == "select" || _cLastKeyWord == "distinct" || _cLastKeyWord == "all" ) {
                //we expect field list to begin from here
                //it will go on till we encounter "from" keyword 
                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "from" ) {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        this._fldslist  = this._fldslist  + _cToken + " ";
                    }
                }
                continue;
            }


            if  (_cLastKeyWord == "from") {
                //we expect tables list to begin from here
                //it will go on till we encounter "perpjoin", "leftperpjoin", "nomatch", "into", "where", "groupby", "orderby" , "limit" keyword 
                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "perpjoin" || _cToken == "leftperpjoin" || _cToken == "ansijoin" || _cToken == "leftansijoin" || _cToken == "nomatch" || _cToken == "into" || _cToken == "where" || _cToken == "groupby" || _cToken == "having" || _cToken == "orderby" ||  _cToken == "limit") {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        this._tableslist  = this._tableslist  + _cToken + " ";
                    }
                }
                continue; 
            }

        
            
            if  (_cLastKeyWord == "perpjoin" || _cLastKeyWord == "leftperpjoin" || _cLastKeyWord == "ansijoin" || _cLastKeyWord == "leftansijoin" || _cLastKeyWord == "nomatch"  ) {
                //we expect join condition to begin from here
                //it will go on till we encounter another "perpjoin" or "into", "where", "groupby", "orderby", "limit" keyword 
                this._joinscount++;
                this._ajoinsobj[this._joinscount-1] = {jointype:"",joincond:"",lhsalias:"",lhskeylist:"",rhsalias:"",rhskeylist:"",lhsseq:0,rhsseq:0,joingraphlevel:0,rhsfurtherjoin:false, rhskeyexp : "",rhskeyevalfx: null, lhsvalueexp : "", lhsevalfx:null};

                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "perpjoin" || _cToken == "leftperpjoin" || _cToken == "ansijoin" || _cToken == "leftansijoin" || _cToken == "nomatch" || _cToken == "into" || _cToken == "where" || _cToken == "groupby" || _cToken == "having"  ||  _cToken == "orderby"  ||  _cToken == "limit") {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        this._ajoinsobj[this._joinscount-1].jointype = _cLastKeyWord;
                        this._ajoinsobj[this._joinscount-1].joincond  = this._ajoinsobj[this._joinscount-1].joincond + _cToken + " ";
                    }
                }
    
                continue;
            }

            if  (_cLastKeyWord == "into" ) {
                //we expect into output to begin from here
                //it will go on till we encounter "where", "groupby", "orderby", "limit" keyword 
                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "where" || _cToken == "groupby" || _cToken == "having" ||  _cToken == "orderby"  ||  _cToken == "limit") {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        if (! this._selectinto) {
                            this._selectinto  = _cToken;
                        } else {
                            this._defineerror  = true;
                            mylib.showError("Error in Sql syntax: invalid token : " + _cToken); 
                            break;
                        }
                    }
                }

                continue;
            }

            if  (_cLastKeyWord == "where" ) {
                //we expect where cond to begin from here
                //it will go on till we encounter  "groupby", "orderby", "limit" keyword 
                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "into" || _cToken == "groupby" || _cToken == "having" ||  _cToken == "orderby"  ||  _cToken == "limit") {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        this._wherecond  = this._wherecond  + _cToken + " ";
                    }
                }

                continue;
            }

            if  (_cLastKeyWord == "groupby" ) {
                //we expect group by list to begin from here
                //it will go on till we encounter  "orderby", "limit" keyword 
                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "into" || _cToken == "having" || _cToken == "orderby"  ||  _cToken == "limit") {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        this._groupbylist  = this._groupbylist  + _cToken + " ";
                    }
                }

                continue;
            }
            
            if  (_cLastKeyWord == "having" ) {
                //we expect having by list to begin from here
                //it will go on till we encounter  "orderby", "limit" keyword 
                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "into" ||  _cToken == "orderby"  ||  _cToken == "limit") {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        this._havingcond  = this._havingcond  + _cToken + " ";
                    }
                }

                continue;
            }

            if  (_cLastKeyWord == "orderby" ) {
                //we expect group by list to begin from here
                //it will go on till we encounter  "limit" keyword 
                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "into" || _cToken == "having" || _cToken == "limit") {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        this._orderbylist  = this._orderbylist  + _cToken + " ";
                    }
                }

                continue;
            }

            if  (_cLastKeyWord == "limit" ) {
                //we expect limit to begin from here
                //it will go on till we encounter  "end" keyword 
                for ( ; _nCtr <= _nArrLen - 1; _nCtr++) {
                    _cToken = _aTokens[_nCtr];
                    if (_cToken == "end") {
                        _cLastKeyWord = _cToken ; 
                        break ;
                    } else {
                        this._limit  =  parseInt(_cToken);
                    }
                }

                continue;
            }

        } //endfor
        // Sql parsing into main components completed

        if (this._defineerror) {
            return this;
        }


        // Parse tables list into _atablesobj
        // check that this._tableslist is not empty
        // also activate input tables so that we can get datastructure information
        let _firsttable = null;

        if (this._tableslist == "") {
            this._defineerror  = true;
            mylib.showError("Error in Sql syntax : from tables list must be specified");
        } else {
            //try to process " custmst a, invhd b"
            const _atablesarr = this._tableslist.split(",");
            this._tablescount  = _atablesarr.length;

            let _cTblStr = "";
            let _aSplitArr = [];

            for (let _nCtr=1; _nCtr <= this._tablescount; _nCtr++)  {
                this._atablesobj[_nCtr-1] = {tablename:"",aliasname:"",tableobject:null};
            
                //try to process "custmst a" or "custmst" or  "m.custmst a" or "m.custmst"
                _cTblStr =  _atablesarr[_nCtr-1].trim() ;
                _aSplitArr = _cTblStr.split(" ") ; //split using " "
                if (_aSplitArr.length == 2) {
                    this._atablesobj[_nCtr-1].aliasname = _aSplitArr[1].trim();  //a goes here
                    this._atablesobj[_nCtr-1].tablename = _aSplitArr[0].trim();  //custmst goes here
                }  else {
                    this._atablesobj[_nCtr-1].tablename = _aSplitArr[0].trim();  //custmst goes here
                    this._atablesobj[_nCtr-1].aliasname = "";
                }
    
                //create a reference to the tables used in sql
                let _lTableOk = false; 
                let _cTableName = this._atablesobj[_nCtr-1].tablename ;
                let _cAliasName = this._atablesobj[_nCtr-1].aliasname ;
                let _thistable = null;
                
                if ( mylib.deepReflectHas(_oTablesScope,_cTableName)) {
                    _thistable =  mylib.deepReflectGet(_oTablesScope,_cTableName) ;
                    if (_thistable.constructor.name == "LocalTable") {
                        _lTableOk = true; 
                    }
                }

                if (_lTableOk) {
                    // we want to evaluate an expression to determine its attributes, if need be 
                    // let us commit the uncommitted record if any
                    _thistable.commit();

                    // store the reference to table object 
                    this._atablesobj[_nCtr-1].tableobject = _thistable;

                    //reference to the table with given alias
                    if (_cAliasName !=="") {
                        if (this._oTablesScope[_cAliasName]) {
                            this._defineerror  = true;
                            mylib.showError("Error in Sql syntax - alias is already in use : " + _cAliasName );
                        } else {
                            // add alias to this._oTablesScope
                            this._oTablesScope[_cAliasName] = _thistable;                    
                        }
                    }

                    if (_nCtr == 1) {
                        _firsttable = _thistable ;
                    }

                } else {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax - invalid tablename : " + _cTableName );
                }
                
                //Now, we can refer to input table , say (from mytable a ) in 3 ways :
                // 1. _firsttable  (hard name _firsttable)  
                // 2. mytable  (ie. the tablename specified)
                // 3. a        (ie. the alias name specified)


                if (_cTableName.substr(0,1) == "_" ) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax - tablename can not begin with underscore : " + _cTableName);
                }

                if (_cAliasName !=="") {
                    if (_cAliasName.substr(0,1) == "_" ) {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax - aliasname can not begin with underscore : " + _cTableName + " " + _cAliasName);
                    }
                }

            } //end for
            
        } //end if

        if (this._tablescount < 1) {
            this._defineerror  = true;
            mylib.showError("Error in Sql syntax - no from table could be found") ;
        }

        if (this._joinscount !== this._tablescount-1) {
            this._defineerror  = true;
            mylib.showError("Error in Sql syntax - incorrect number of join conditions") ; 
        }
        
        // check output table
        if (this._selectinto !== "") {
            let _outtable = null;
            let _lTableOk = false;
            if ( mylib.deepReflectHas(_oTablesScope,this._selectinto)) {
                _outtable =  mylib.deepReflectGet(_oTablesScope,this._selectinto) ;
                if (_outtable.constructor.name == "LocalTable") {
                    _lTableOk = true; 
                }
            }
        
            if (! _lTableOk) {
                this._defineerror  = true;
                mylib.showError("Error in Sql syntax - invalid output tablename : " + this._selectinto );
            }

            if (this._selectinto.substr(0,1) == "_" ) {
                this._defineerror  = true;
                mylib.showError("Error in Sql syntax - output tablename can not begin with underscore : " + this._selectinto);
            }
        } 

        if (this._defineerror) {
            return this;
        }

        // Parse Join Conditions
        if (this._joinscount > 0) {
            let _ajoinarr  = [];
            let _cLhsStr = "";
            let _cRhsStr = "";
            let _aSplitArr =  [];
            let _cKeyList = "";
            let _nAnsiJoinsCnt = 0;

            for (let _nCtr=1; _nCtr <= this._joinscount; _nCtr++)  {
                //split join condition into _cLhsStr and _cRhsStr
                _ajoinarr = this._ajoinsobj[_nCtr -1].joincond.split("==");

                if (_ajoinarr.length !== 2) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax - join condition must use == operator ") ;
                    return this;
                }

                _cLhsStr =  _ajoinarr[0].trim() ;
                _cRhsStr =  _ajoinarr[1].trim() ;
    
                //split _cLhsStr into table alias and key list
                _aSplitArr = [];
                _aSplitArr = _cLhsStr.split(".") ; // split using .
                if (_aSplitArr.length > 1) {
                    _cKeyList = _aSplitArr[_aSplitArr.length - 1].trim() ;
                    _cKeyList = mylib.strtran(_cKeyList,"(","") ;
                    _cKeyList = mylib.strtran(_cKeyList,")","") ;
                    this._ajoinsobj[_nCtr -1].lhskeylist  = _cKeyList;

                    // Very IMP : Table or alias names may be object property with embeded dots
                    // special logic to deal with it. We split the string into array based on dots, 
                    //  we used the keylist part, let's pop it off, and join the rest back.
                    _aSplitArr.pop();
                    this._ajoinsobj[_nCtr -1].lhsalias  = _aSplitArr.join("."); 
                } else {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax - LHS of  join condition is not properly specified : " + _cLhsStr) ;
                    return this;
                }

                //check if the lhstablealias is valid
                for (let _nCtrx=1;_nCtrx <= this._tablescount; _nCtrx++)  {
                    //this._atablesobj[_nCtrx-1] = {tablename:"",aliasname:"", tableobject:null};
                    if (this._ajoinsobj[_nCtr -1].lhsalias == this._atablesobj[_nCtrx-1].tablename || (this._ajoinsobj[_nCtr -1].lhsalias !== "" && this._ajoinsobj[_nCtr -1].lhsalias == this._atablesobj[_nCtrx-1].aliasname)) {
                        this._ajoinsobj[_nCtr -1].lhsseq = _nCtrx;
                        break;
                    }
                }
                
                if (this._ajoinsobj[_nCtr -1].lhsseq == 0) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql - LHS of the join is not a valid table : " + this._ajoinsobj[_nCtr -1].lhsalias ) ;
                    return this;
                }


                //repeat code for _cRhsStr
                //split _cRhsStr into table alias and key list
                _aSplitArr = [];
                _aSplitArr = _cRhsStr.split(".") ; // split using .
                if (_aSplitArr.length > 1) {
                    _cKeyList = _aSplitArr[_aSplitArr.length - 1].trim() ;
                    _cKeyList = mylib.strtran(_cKeyList,"(","") ;
                    _cKeyList = mylib.strtran(_cKeyList,")","") ;
                    this._ajoinsobj[_nCtr -1].rhskeylist  = _cKeyList;

                    _aSplitArr.pop();
                    this._ajoinsobj[_nCtr -1].rhsalias  = _aSplitArr.join("."); //table or alias names may be object property with embeded dots
                } else {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax - RHS of  join condition is not properly specified : " + _cRhsStr) ;
                    return this;
                }

                //check if the rhstablealias is valid
                for (let _nCtrx=1;_nCtrx <= this._tablescount; _nCtrx++)  {
                    //this._atablesobj[_nCtrx-1] = {tablename:"",aliasname:"",tableobject:null};
                    if (this._ajoinsobj[_nCtr -1].rhsalias == this._atablesobj[_nCtrx-1].tablename || (this._ajoinsobj[_nCtr -1].rhsalias !== "" && this._ajoinsobj[_nCtr -1].rhsalias == this._atablesobj[_nCtrx-1].aliasname)) {
                        this._ajoinsobj[_nCtr -1].rhsseq = _nCtrx;
                        break;
                    }
                }
                
                if (this._ajoinsobj[_nCtr -1].rhsseq == 0) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql - RHS of the join condition is not a valid table : " + this._ajoinsobj[_nCtr -1].rhsalias ) ;
                    return this;
                }

                if (this._ajoinsobj[_nCtr -1].rhsseq == 1) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql - RHS of the join condition can not be the first table : " + this._ajoinsobj[_nCtr -1].rhsalias ) ;
                    return this;
                }

                //also check that both lhs and rhs are not same
                if (this._ajoinsobj[_nCtr -1].lhsseq  == this._ajoinsobj[_nCtr -1].rhsseq ) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax - lhs and rhs of  join condition can not refer to same table or alias : " + this._ajoinsobj[_nCtr -1].joincond ) ;
                    return this;
                }


                //if lhsseq > 1, then ansijoin and leftansijoin not allowed 
                if (this._ajoinsobj[_nCtr -1].lhsseq > 1 && (this._ajoinsobj[_nCtr-1].jointype == "ansijoin" || this._ajoinsobj[_nCtr-1].jointype == "leftansijoin") ) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : for tables except first table - join or leftjoin is not allowed; only joinfirst, leftjoinfirst and nomatch are allowed") ;
                    return this;
                }
    
                //if lhsseq == 1, then max one ansijoin or leftansijoin is allowed
                //update joingraphlevel in _ajoinsobj
                if (this._ajoinsobj[_nCtr -1].lhsseq == 1) { 
                    this._ajoinsobj[_nCtr-1].joingraphlevel  = 1; 
                    if (this._ajoinsobj[_nCtr-1].jointype == "ansijoin" || this._ajoinsobj[_nCtr-1].jointype == "leftansijoin") {
                        _nAnsiJoinsCnt++;
                    }    
                }   
                
                if (!this._defineerror) {
                    //update rhskeyexp and lhsvalueexp
                    let _cLhsAlias = this._ajoinsobj[_nCtr -1].lhsalias ;
                    let _cLhsKeyList = this._ajoinsobj[_nCtr -1].lhskeylist;
                    let _cRhsAlias = this._ajoinsobj[_nCtr -1].rhsalias ;
                    let _cRhsKeyList = this._ajoinsobj[_nCtr -1].rhskeylist;
                    let _rhsTable = this._atablesobj[this._ajoinsobj[_nCtr -1].rhsseq -1].tableobject;

                    this._ajoinsobj[_nCtr -1].rhskeyexp =  _rhsTable.bldIndexExp(_cRhsKeyList, _cRhsAlias) ;
                    this._ajoinsobj[_nCtr -1].rhskeyevalfx = Function("sqlscope", 'return ' +  _rhsTable.bldIndexExp(_cRhsKeyList, "sqlscope."+_cRhsAlias) );

                    this._ajoinsobj[_nCtr -1].lhsvalueexp = _rhsTable.bldValueExp(_cRhsKeyList, _cLhsKeyList, _cLhsAlias) ;
                    this._ajoinsobj[_nCtr -1].lhsevalfx = Function("sqlscope", 'return ' +   _rhsTable.bldValueExp(_cRhsKeyList, _cLhsKeyList, "sqlscope."+_cLhsAlias) );

        
                    // test that rhskeyexp is not empty (bldindexexp failed!)
                    if (this._ajoinsobj[_nCtr -1].rhskeyexp == "") {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax : join key is incorrect for " + _cRhsAlias) ;
                        return this;
                    }

                    // build index for rhs if needed
                    let _lResult = _rhsTable.setCurIndex(_cRhsKeyList) ;
                    if (! _lResult ) {
                        _lResult = _rhsTable.indexOn(_cRhsKeyList) ;
                        if (_lResult) {
                            _lResult = _rhsTable.setCurIndex(_cRhsKeyList) ;
                        }
                    }

                    if (! _lResult) {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax : join key is incorrect for " + _cRhsAlias) ;
                        return this;
                    }
                }
            } //endfor
    
            if (_nAnsiJoinsCnt > 1 ) {
                this._defineerror  = true;
                mylib.showError("Error in Sql syntax : for first table a maximum of one join or leftjoin is allowed") ;
                return this;
            }

            //let's then build Level 2 join graph
            // only perpjoin, leftperpjoin, nomatch are allowed, because we checked the ansijoin and leftansijoin are not allowed for 
            // any table with tblseq > 1
            for (let _nCtr = 1; _nCtr <= this._joinscount; _nCtr++ ) {
                if (this._ajoinsobj[_nCtr-1].joingraphlevel == 1)  {
                    let _nRhsSeq = this._ajoinsobj[_nCtr -1].rhsseq ;

                    for (let _nCtrx = 1; _nCtrx <= this._joinscount; _nCtrx++ ) {
                        if ( this._ajoinsobj[_nCtrx-1].lhsseq == _nRhsSeq) {
                            this._ajoinsobj[_nCtrx-1].joingraphlevel  = 2; 

                            // set rhsfurtherjoin flag of previous level
                            this._ajoinsobj[_nCtr -1].rhsfurtherjoin = true;
                            continue;
                        }

                    }
                }
            }
    
            //let's then build Level 3 join graph
            // only perpjoin, leftperpjoin, nomatch are allowed, because we checked the ansijoin and leftansijoin are not allowed for 
            // any table with tblseq > 1
            for (let _nCtr = 1; _nCtr <= this._joinscount; _nCtr++ ) {
                if (this._ajoinsobj[_nCtr-1].joingraphlevel == 2)  {
                    let _nRhsSeq = this._ajoinsobj[_nCtr -1].rhsseq ;

                    for (let _nCtrx = 1; _nCtrx <= this._joinscount; _nCtrx++ ) {
                        if ( this._ajoinsobj[_nCtrx-1].lhsseq == _nRhsSeq) {
                            this._ajoinsobj[_nCtrx-1].joingraphlevel  = 3; 

                            // set rhsfurtherjoin flag of previous level
                            this._ajoinsobj[_nCtr -1].rhsfurtherjoin = true;
                            continue;
                        }

                    }
                }
            }    
        
            //let's now find if some joinobj is not used 
            //let's find other errors also
            let _cRhsSeqList = "";
            for (let _nCtr = 1; _nCtr <= this._joinscount; _nCtr++ ) {
                if (this._ajoinsobj[_nCtr-1].joingraphlevel == 0)  {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : joingraph could not be determined for join condition : " + this._ajoinsobj[_nCtr-1].joincond ) ;
                    return this;
                }
                
                _cRhsSeqList = (_cRhsSeqList !=="") ?  _cRhsSeqList  + ";" + this._ajoinsobj[_nCtr-1].rhsseq + "" : this._ajoinsobj[_nCtr-1].rhsseq + "";
                // check if we have duplicates in this list ?  
                if (mylib.chkDupLst(_cRhsSeqList, ";")) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : one table can not be used more than once on RHS of join conditions") ;
                    return this;
                }
            }

        } //endif

        if (this._defineerror) {
            return this;
        }


        //check that this._fldslist is not empty , it is either * or some valid list
        //parse fields list into _afldsobj
        //this._afldsobj[0] = {fldexpr:"",sqlop:"",fieldname:"",datatype:"",len:10,dec:0,objtemplate:"",objclassname:"", evalfx:null};
        if (this._fldslist == "" && this._tablescount == 1) {
            this._fldslist = "*" ;
        } 

        if (this._fldslist == "") {
            this._defineerror  = true;
            mylib.showError("Error in Sql syntax : a valid field list must be specified");
            return this;
        } else {
            // try to process
            //unqualified wildcard :  * (allowed only if one table specified ; moreover as clause not allowed)
            //qualified wildcard : custmst.*, a.* (as clause not allowed)
            //specific field :  a.custcd, b.invqty, custmst.limit, b.invdt as mydate (as clause is optional)
            //object : a.userinfo (as clause is optional)
            //subobjects : a.userinfo.address (as clause is optional)
            //object property : a.userinfo.address.city (as clause is optional)
            //expression : substr(custname,1,15) as shortname (as clause must be given)
            //             (a.saleqty*b.rate) as value 
            //             sum(a.saleqty*b.rate) as totalvalue
            //constant : "A001" as custcd, 0.00 as amt (as clause must be given) 
            //sql op - (sum, avg, min, max, count) : sum(b.value) as totval, count(*) as totrecs (as clause must be given)
            //Important : Moreover, alias in fieldname is optional if only one table is specified, else alias is compulsory
            let _cFldsList  = this._fldslist ;
            let _nFldsListLen = _cFldsList.length;
        
            //convert , at end of each field clause to ; 
            let _nPendingBrackets = 0;

            for (let _nCtr=1; _nCtr <= _nFldsListLen ; _nCtr++) {
                if (_cFldsList.substr(_nCtr-1,1) == "(" || _cFldsList.substr(_nCtr-1,1) == "{") {
                    _nPendingBrackets++; 
                }
                if (_cFldsList.substr(_nCtr-1,1) == ")" || _cFldsList.substr(_nCtr-1,1) == "}") {
                    _nPendingBrackets--; 
                }

                if (_nPendingBrackets == 0 && _cFldsList.substr(_nCtr-1,1) == "," ) {
                    // replace with ;
                    _cFldsList =  _cFldsList.substr(0,_nCtr-1) + ";" + _cFldsList.substr(_nCtr) ;
                }
            } 

            // split fields clauses 
            let fldsarr = _cFldsList.split(";");

            let _nFldsObj = 0;

            let _cFldClause = "";
            let _cFldStr = "";

            let _lConstant   = false;
            let _lExpression = false;
            let _lObjProperty = false;

            let _nWildCardTblSeq = 0; 
            let _nRegFldTblSeq = 0; 
            let _cRegFldName   = "";


            for (let _nCtr=1; _nCtr <= fldsarr.length; _nCtr++)  {
                //init output field object
                _nFldsObj++;   //we use another variable rather than _nCtr because a wildcard will create several field objects
                this._afldsobj[_nFldsObj - 1] = {fldexpr:"",sqlop:"",fieldname:"",datatype:"",len:10,dec:0,objtemplate:"",objclassname:"", evalfx:null};

                //init these
                _lConstant   = false;
                _lExpression = false;
                _lObjProperty = false;
            
                _nWildCardTblSeq = 0; 
                _nRegFldTblSeq = 0; 
                _cRegFldName   = "";
        
        
                //get a field clause and try to process it -  eg. "sum(b.qty) as myqty N:12:2"
                _cFldClause =  fldsarr[_nCtr-1].trim() ;

                //Process "as clause" first - eg. "sum(b.qty) as myqty N:12:2"
                let _aSplitArr = _cFldClause.split(" as ") ; //split using " as "

                // get the field string 
                _cFldStr = _aSplitArr[0].trim(); //sum(b.qty) goes here

                if (_aSplitArr.length == 2) {
                    let _cAsClause = _aSplitArr[1].trim();
                    let _aAsSplitArr = _cAsClause.split(" "); // split using space to separate myqty N:12:2
                    
                    // set field name and optionally datatype, len, dec , objtemplate etc.
                    this._afldsobj[_nFldsObj - 1].fieldname = _aAsSplitArr[0].trim();  //myqty goes here

                    if (_aAsSplitArr.length > 1) {
                        // remove the first element (the fieldname)
                        _aAsSplitArr.shift(); 

                        // process rest
                        // in case there are more than 2 parts because of spaces between such as N : 12 : 2 or objtemplate : <template>,
                        // join them back
                        let _cRemStr = _aAsSplitArr.join(" "); 

                        // we have data descriptor part
                        // it may be datatype & size descriptor or objtemplate or objclassname 
                        let _aTypeSplitArr = _cRemStr.trim().split(":");
                        if (_aTypeSplitArr[0].trim().toLowerCase() == "objtemplate" || _aTypeSplitArr[0].trim().toLowerCase() == "objclassname") {
                            this._afldsobj[_nFldsObj - 1].datatype = "O";
                            this._afldsobj[_nFldsObj - 1].len  = 10;
                            this._afldsobj[_nFldsObj - 1].dec  = 0;

                            if (_aTypeSplitArr.length == 1) {
                                this._defineerror  = true;
                                mylib.showError("Error in Sql syntax : invalid objtemplate or objclassname syntax : " + _cRemStr);
                                return this;
                            }

                            if (_aTypeSplitArr[0].trim().toLowerCase() == "objtemplate") {
                                _aTypeSplitArr.shift(); 
                                let _cObjTemplStr = _aTypeSplitArr.join(":");
                                try {
                                    let _fTemplEvalFx = Function('return ' + _cObjTemplStr);
                                    this._afldsobj[_nFldsObj - 1].objtemplate =  _fTemplEvalFx();
                                } catch (error) {
                                    this._defineerror  = true;
                                    mylib.showError("Error in Sql syntax : invalid objtemplate : " + _cObjTemplStr + ", " + error);
                                    return this;
                                }
                            } else {
                                this._afldsobj[_nFldsObj - 1].objclassname = _aTypeSplitArr[1].trim();
                            }
                        } else {  
                            this._afldsobj[_nFldsObj - 1].datatype = _aTypeSplitArr[0].trim().toUpperCase();  //N goes here
                            if (_aTypeSplitArr.length > 1) {
                                this._afldsobj[_nFldsObj - 1].len = _aTypeSplitArr[1].trim();  //12 goes here
                            }
                            if (_aTypeSplitArr.length > 2) {
                                this._afldsobj[_nFldsObj - 1].dec = _aTypeSplitArr[2].trim();  //2 goes here
                            }
                        }
                    }
                }  
            
        
                //process constants and literals : "A001" as custcd, 0.00 as amt (as clause must be given)
                if (_cFldStr.substr(0,1) == "'" || _cFldStr.substr(0,1) == '"' || _cFldStr.substr(0,1) == "`" || mylib.isdigit(_cFldStr.substr(0,1)) || _cFldStr.substr(0,4) == "true" || _cFldStr.substr(0,5) == "false"  || _cFldStr.substr(0,1) == "{") {
                    _lConstant   = true;
                    this._afldsobj[_nFldsObj - 1].fldexpr = _cFldStr;
                    this._afldsobj[_nFldsObj - 1].evalfx = Function("sqlscope", 'return ' + this._afldsobj[_nFldsObj - 1].fldexpr);

                    //Check if fldexpr evals
                    let _uValue = null;
                    try {
                        _uValue = this._afldsobj[_nFldsObj - 1].evalfx();
                    } catch (error) {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax : invalid Constant or literal syntax : " + _cFldStr + ", " + error);
                        return this;
                    }


                    //check if as clause not specified
                    if (this._afldsobj[_nFldsObj - 1].fieldname == "" ) {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax : as clause must be specified if a constant literal is used in select fields list " + _cFldStr);
                        return this;
                    }

                    if (this._afldsobj[_nFldsObj - 1].datatype == "") { 
                        if (typeof _uValue == "string") {
                            this._afldsobj[_nFldsObj - 1].datatype = "C"; 
                            this._afldsobj[_nFldsObj - 1].len = _cFldStr.length-2; 
                            this._afldsobj[_nFldsObj - 1].dec = 0; 
                        }

                        if (typeof _uValue == "number") {
                            this._afldsobj[_nFldsObj - 1].datatype = "N"; 
                            this._afldsobj[_nFldsObj - 1].len = _cFldStr.length; 
                            this._afldsobj[_nFldsObj - 1].dec = _cFldStr.indexOf(".") == -1 ? 0 :  _cFldStr.length - _cFldStr.indexOf(".") - 1;
                        }

                        if (typeof _uValue == "boolean") {
                            this._afldsobj[_nFldsObj - 1].datatype = "L"; 
                            this._afldsobj[_nFldsObj - 1].len = 1; 
                            this._afldsobj[_nFldsObj - 1].dec = 0; 
                        }

                        if (typeof _uValue == "object") {
                            this._afldsobj[_nFldsObj - 1].datatype = "O"; 
                            this._afldsobj[_nFldsObj - 1].len = 10; 
                            this._afldsobj[_nFldsObj - 1].dec = 0; 
                            this._afldsobj[_nFldsObj - 1].objtemplate =  _uValue;
                        }
                    }

                    continue;
                } 
                
            
                //now try to process sql operator
                if (mylib.at("sum(", _cFldStr) > 0 || mylib.at("avg(", _cFldStr) > 0 || mylib.at("min(", _cFldStr) > 0 || mylib.at("max(", _cFldStr) > 0 || mylib.at("count(", _cFldStr) > 0 ) {
                    let _aSplitArr = _cFldStr.split("(") ;  //split using left (
                    this._afldsobj[_nFldsObj - 1].sqlop = _aSplitArr[0].trim(); //sum goes here

                    //get the remaining string
                    _aSplitArr.shift(); 
                    _cFldStr = _aSplitArr.join("(") ; // if there was a left bracket eg. sum(val(x)) - then we want val(x)) back 
                    _cFldStr = _cFldStr.trim();  //b.qty) goes here

                    //remove rightmost right )
                    _cFldStr = _cFldStr.substr(0,_cFldStr.length -1)
                    
                    //Now, the above _cFldStr now might contain field, object,  subject , object property, or expression

                    //check if as clause specified
                    if (this._afldsobj[_nFldsObj - 1].fieldname == "" ) {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax : as clause must be specified if a SQL operator is used on a selected field");
                        return this;
                    }

                    // special logic for count(*)
                    if (this._afldsobj[_nFldsObj - 1].sqlop == "count") {
                        this._afldsobj[_nFldsObj - 1].fldexpr = 1;
                        this._afldsobj[_nFldsObj - 1].evalfx = Function("sqlscope", 'return 1');
                        if (this._afldsobj[_nFldsObj - 1].datatype == "") { // update only if datatype is empty - skip if datatype == "X" - object property
                            this._afldsobj[_nFldsObj - 1].datatype = "N"; 
                            this._afldsobj[_nFldsObj - 1].len = 10; 
                            this._afldsobj[_nFldsObj - 1].dec = 0; 
                        }    

                        continue;
                    }

                    //Now, the above _cFldStr now might contain field, object,  sub-object , object property, or expression
                    // we need to process it further !
                } 

        
                //Process expression : substr(custname,1,15) as shortname (as clause must be given)
                _cFldStr = _cFldStr.trim() ;
                let _cFldName = "";
                let _cTblAlias = "";
                if (_cFldStr.length > 1 && (_cFldStr.substr(_cFldStr.length-2) !== ".*") &&  (mylib.at("(", _cFldStr) > 0 || mylib.at("+", _cFldStr) > 0 || mylib.at("-", _cFldStr) > 0 || mylib.at("*", _cFldStr) > 0 || mylib.at("/", _cFldStr) > 0 || mylib.at("?", _cFldStr) > 0 || mylib.at("==", _cFldStr) > 0 || mylib.at(",", _cFldStr) > 0 || mylib.at("?", _cFldStr) > 0     )) {
                    // we have skipped things like *, mytable.* , a.*  
                    // now, we possibly have expressions
                    _lExpression = true;
                    this._afldsobj[_nFldsObj - 1].fldexpr = _cFldStr;
                    let _cNewExpr = this.getReformedExpr(_cFldStr);
                    this._afldsobj[_nFldsObj - 1].evalfx = Function("sqlscope", 'return ' + _cNewExpr);

                    //Check if fldexpr evals
                    try {
                        let _uValue = this._afldsobj[_nFldsObj - 1].evalfx(this._oTablesScope) ;
                    } catch (error) {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax : invalid Expression " + _cFldStr + ", " + error);
                        return this;
                    }

                    //check if as clause specified
                    if (this._afldsobj[_nFldsObj - 1].fieldname == "" ) {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax : as clause must be specified if an expression is used in select fields list " + _cFldStr);
                        return this;
                    }

                }  else  {
                    //Non Expressions
                    //Now Try to process :
                    //specific field :  a.custcd, b.invqty, custmst.limit, b.invdt as mydate (as clause may be given)
                    //object : m.mytable.address (as clause is optional)
                    //object property : m.mytable.address.city (if as clause not specified, inject it)
                    //qualified wildcard : custmst.*, a.* (as clause not allowed)
                    //unqualified wildcard :  * (if only one table, as clause not allowed)
                    //field used inside sql operaror : sum(b.qty) 

                    let _nTblSeq = 0;

                    // find tablealias, table seq and field name
                    for (let _nCtrx=1; _nCtrx <= this._tablescount; _nCtrx++) {
                        if (this._atablesobj[_nCtrx-1].tablename == _cFldStr.substr(0, this._atablesobj[_nCtrx-1].tablename.length)) {
                            _nTblSeq = _nCtrx;
                            _cTblAlias = this._atablesobj[_nCtrx-1].tablename ;
                            _cFldName  = _cFldStr.substr(this._atablesobj[_nCtrx-1].tablename.length+1) ;
                            break;
                        } 


                        if (this._atablesobj[_nCtrx-1].aliasname !== "" &&  this._atablesobj[_nCtrx-1].aliasname == _cFldStr.substr(0, this._atablesobj[_nCtrx-1].aliasname.length)) {
                            _nTblSeq = _nCtrx;
                            _cTblAlias = this._atablesobj[_nCtrx-1].aliasname ;
                            _cFldName  = _cFldStr.substr(this._atablesobj[_nCtrx-1].aliasname.length+1) ;
                            break;
                        } 
                    }

                    if (_nTblSeq == 0) {
                        // if we don't have a table qualifier
                        // first check that only one table specified
                        if (this._tablescount > 1) {
                            this._defineerror  = true;
                            mylib.showError("Error in Sql syntax : a select field must be qualified using tablename or aliasname if more than one table is used");
                            return this;
                        } else {
                            // we set the table seq to 1,  if there is only one table   
                            _nTblSeq = 1; 
                            _cTblAlias =  this._atablesobj[0].tablename ;
                        }

                        //get field's name 
                        _cFldName = _cFldStr;
                    }


                    if (_cFldName == "*") {
                        //check if fieldname is wildcard , then check that :
                        // 1. no other sql operator except count is used
                        // 2. as clause is not used except for count(*)
                        if (this._afldsobj[_nFldsObj - 1].sqlop !== "") {
                            this._defineerror  = true;
                            mylib.showError("Error in Sql syntax : invalid sql operator " + this._afldsobj[_nFldsObj - 1].sqlop + " used on a wildcard" );
                            return this;
                        }  else {
                            //check that as clause is not specified for wildcards
                            if (this._afldsobj[_nFldsObj - 1].fieldname !== "" ) {
                                this._defineerror  = true;
                                mylib.showError("Error in Sql syntax : as clause can not be specified for a wildcard in select fields list");
                                return this;
                            }
        
                            //inject all wildcard fields in _afldsobj in subsequent steps
                            _nWildCardTblSeq = _nTblSeq;
                        }
                    } else  {
                        // not a wild card 
                        // fields , objects , subobjects or object properties
                        this._afldsobj[_nFldsObj - 1].fldexpr = _cTblAlias + "." + _cFldName;
                        this._afldsobj[_nFldsObj - 1].evalfx = Function("sqlscope", 'return sqlscope.' + this._afldsobj[_nFldsObj - 1].fldexpr);
            
                        //check if fldexpr evals
                        //let _cStr = _cTblAlias + "." + _cFldName ;
                        let _lFieldOk = true;
                        try {
                            this._afldsobj[_nFldsObj - 1].evalfx(this._oTablesScope)
                        } catch (error) {
                            _lFieldOk = false;
                        }

                        if (_lFieldOk == false) { 
                            this._defineerror  = true;
                            mylib.showError("Error in Sql syntax : invalid Expression/Field " + _cFldName);
                            return this;
                        }
                        
                        if (mylib.at(".", _cFldName) > 0 ) {
                            //it is a subobject or  object property, check if as clause specified, if not inject
                            _lObjProperty = true;

                            //check if as clause specified, if not inject the last token after last dot
                            if (this._afldsobj[_nFldsObj - 1].fieldname == "" ) {
                                let _aSplitArr = _cFldName.split(".") ;  //split using .
                                this._afldsobj[_nFldsObj - 1].fieldname = _aSplitArr[_aSplitArr.length -1];
                            }
                        } else {
                            //check if as clause specified, if not inject fieldname itself  
                            if (this._afldsobj[_nFldsObj - 1].fieldname == "" ) {
                                this._afldsobj[_nFldsObj - 1].fieldname = _cFldName;
                            }
                        }

                        _nRegFldTblSeq = _nTblSeq; 
                        _cRegFldName   = _cFldName;
                    }
                }

                if (this._defineerror) {
                    return this;
                }
        
                // for wildcards, injects fields
                // for regular fields, fit datatype, len, dec etc.
                if (_nWildCardTblSeq > 0 ) {
                    //inject wild card fields for given table sequence
                    let _aStruct = mylib.deepReflectGet(this._oTablesScope, this._atablesobj[_nWildCardTblSeq-1].tablename + "._astructdef");
                    let _nStruLen  = _aStruct.length ;

                    //take care that we already have one array inited
                    _nFldsObj--;  
                        
                    // loop thru structure 
                    for (let _nCtr1=0; _nCtr1 <= _nStruLen - 1; _nCtr1++) {
                        _nFldsObj++;  
                        this._afldsobj[_nFldsObj - 1] = {fldexpr:"",sqlop:"",fieldname:"",datatype:"",len:10,dec:0};

                        
                        let _oFldStru = _aStruct[_nCtr1]; 
                        //_oFldStru = {fieldname:"itemcd",datatype:"C",len:15,dec:0}
                        this._afldsobj[_nFldsObj - 1].fieldname = _oFldStru.fieldname.trim();
                        this._afldsobj[_nFldsObj - 1].datatype = _oFldStru.datatype;
                        this._afldsobj[_nFldsObj - 1].len  = _oFldStru.len;
                        this._afldsobj[_nFldsObj - 1].dec  = _oFldStru.dec;
                        this._afldsobj[_nFldsObj - 1].objtemplate = _oFldStru.objtemplate; 
                        this._afldsobj[_nFldsObj - 1].objclassname = _oFldStru.objclassname; 
                        this._afldsobj[_nFldsObj - 1].fldexpr = this._atablesobj[_nWildCardTblSeq - 1].tablename.trim() + "." + _oFldStru.fieldname.trim();
                        this._afldsobj[_nFldsObj - 1].evalfx = Function("sqlscope", 'return sqlscope.' + this._afldsobj[_nFldsObj - 1].fldexpr);
                    } //endfor
        
                } else {

                    // non wild card fields (regular fields)
                    // fit datatype, len, dec etc. if required

                    if (_nRegFldTblSeq > 0 && _cRegFldName !== "" && _lObjProperty == false) {
                        // Regular Table simple Fields
                        let _aStruct = mylib.deepReflectGet(this._oTablesScope, this._atablesobj[_nRegFldTblSeq-1].tablename + "._astructdef");
                        let _nStruLen  = _aStruct.length ;
                        let _lFieldOk = false;

                        // find the field in the structure 
                        for (let _nCtr1=0; _nCtr1 <= _nStruLen - 1; _nCtr1++) {
                            let _oFldStru = _aStruct[_nCtr1]; 
                            if (_cRegFldName ==  _oFldStru.fieldname.trim()) {
                                _lFieldOk = true;

                                // update datatype etc. from table structure only if blank (descriptor not given)
                                if (this._afldsobj[_nFldsObj - 1].datatype == "") {
                                    this._afldsobj[_nFldsObj - 1].datatype = _oFldStru.datatype;
                                    this._afldsobj[_nFldsObj - 1].len  = _oFldStru.len;
                                    this._afldsobj[_nFldsObj - 1].dec  = _oFldStru.dec;
                                    this._afldsobj[_nFldsObj - 1].objtemplate = _oFldStru.objtemplate; 
                                    this._afldsobj[_nFldsObj - 1].objclassname = _oFldStru.objclassname; 
                                }
                                break;
                            } 
                        } //endfor


                        if (_lFieldOk == false) {
                            this._defineerror  = true;
                            mylib.showError("Error in Sql syntax : invalid Field " + _cRegFldName);
                            return this;
                        }
                    
                    } else {
                        // Now, we have already done constants, regular fields, wild card fields

                        // So, here we basically have expressions : 
                        // subobjects  such as a.userinfo.address 
                        // object properties such as a.userinfo.address.city 
                        // object methods - such as a.recno() 
                        // other expressions etc. - such as a.qty * b.rate 
                        // Expressions with associated sql operators also 

                        // js object properties do not carry data type information, so we need to infer it.
                        if (this._afldsobj[_nFldsObj - 1].datatype == "") {
                            //try to evaluate expression and put data type 
                            let _cFldExpr = this._afldsobj[_nFldsObj - 1].fldexpr ;
                            
                            let _uFldExprVal = null;
                            try {
                                _uFldExprVal =  this._afldsobj[_nFldsObj - 1].evalfx(this._oTablesScope);
                            } catch (error) {
                                this._defineerror  = true;
                                mylib.showError("Error in Sql syntax : invalid Expression or object property : " + _cFldExpr + ", " + error);
                                return this;
                            }
            
                            if (typeof _uFldExprVal == "string") {
                                this._afldsobj[_nFldsObj - 1].datatype = "C";
                                this._afldsobj[_nFldsObj - 1].len  = _uFldExprVal.length;
                                if (this._afldsobj[_nFldsObj - 1].len == 0) {
                                    this._afldsobj[_nFldsObj - 1].len = 10; 
                                } 
                                this._afldsobj[_nFldsObj - 1].dec  = 0;
                                continue;
                            }

                            if (typeof _uFldExprVal == "number") {
                                this._afldsobj[_nFldsObj - 1].datatype = "N";
                                let _cEvalExpr =  _uFldExprVal + "" ;
                                this._afldsobj[_nFldsObj - 1].len  = (_cEvalExpr).length;
                                if (this._afldsobj[_nFldsObj - 1].len == 0) {
                                    this._afldsobj[_nFldsObj - 1].len = 10; 
                                } 
                                this._afldsobj[_nFldsObj - 1].dec =  _cEvalExpr.indexOf(".") == -1 ? 0 :  _cEvalExpr.length - _cEvalExpr.indexOf(".") - 1;
                                continue;
                            }

                            if (typeof _uFldExprVal == "boolean") {
                                this._afldsobj[_nFldsObj - 1].datatype = "L";
                                this._afldsobj[_nFldsObj - 1].len  = 1;
                                this._afldsobj[_nFldsObj - 1].dec =  0;
                                continue;
                            }

                            if (typeof _uFldExprVal == "object") {
                                this._afldsobj[_nFldsObj - 1].datatype = "O";
                                this._afldsobj[_nFldsObj - 1].len  = 10;
                                this._afldsobj[_nFldsObj - 1].dec =  0;

                                if (_cFldName !== "") {
                                    // it is perhaps a subobject 
                                    // take object's template from structure of source table
                                    let _cObjTemplExp = _cTblAlias + "._struct." + _cFldName;
                                    let _fTemplEvalFx = Function('sqlscope', 'return sqlscope.' + _cObjTemplExp);

                                    try {
                                        this._afldsobj[_nFldsObj - 1].objtemplate =  _fTemplEvalFx(this._oTablesScope);
                                    } catch (error) {
                                        this._defineerror  = true;
                                        mylib.showError("Error in Sql syntax : invalid object " + _cFldName + ", " + error);
                                        return this;
                                    }

                                } else {
                                    //TODO - treat as object literal
                                    // when do we come here ?
                                    debugger;
                                }

                                continue;
                            }
                        } 
                    }
                }
            
                if (this._defineerror) {
                    return this;
                }
                    
            } //end for

            if (this._defineerror) {
                return this;
            }
   
    
            // check that this._afldsobj passes some checks as follows :
            // 1. fieldname not empty
            // 2. fldexpr not empty
            // 3. datatype is not empty - ie. it is not specified or nor discovered
            // 4. no duplicate fieldname, ie. they are unique

            //this._afldsobj[0] = {fldexpr:"",sqlop:"",fieldname:"",datatype:"",len:10,dec:0,objtemplate:"",objclassname:""};
            let _nFlds = this._afldsobj.length;
            for (let _nCtr=1; _nCtr <= _nFlds ; _nCtr++) {
                if (this._afldsobj[_nCtr-1].fieldname == "") {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : invalid Field " );
                    continue;
                }  

                if (this._afldsobj[_nCtr-1].fldexpr == "") {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : invalid Field Expression for " + this._afldsobj[_nCtr-1].fieldname );
                    continue;
                }  

                if (this._afldsobj[_nCtr-1].datatype == "") {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : unknown datatype for " + this._afldsobj[_nCtr-1].fieldname );
                    continue;
                }  

                if (this._afldsobj[_nCtr-1].len == 0) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : unknown length for " + this._afldsobj[_nCtr-1].fieldname );
                    continue;
                }  

                for (let _nCtrx=_nCtr+1; _nCtrx <= _nFlds ; _nCtrx++) {
                    if (this._afldsobj[_nCtr-1].fieldname == this._afldsobj[_nCtrx-1].fieldname) {
                        this._defineerror  = true;
                        mylib.showError("Error in Sql syntax : duplicate field for " + this._afldsobj[_nCtr-1].fieldname );
                        continue;
                    }
                }

                // increase len by 2 bytes if sum operator used
                if (this._afldsobj[_nFldsObj - 1].sqlop == "sum") {
                    this._afldsobj[_nFldsObj - 1].len =  this._afldsobj[_nFldsObj - 1].len + 2; 
                }
            }
        } //end if

        if (this._defineerror) {
            return this;
        }

        // Test if wherecond is valid
        if (this._wherecond !== "") {
            if (this._tablescount == 1) {
                // The elements of wherecondition must be qualified with either source table name or source table alias.
                // However, if there is only one table specified in from clause, the qualifier is optional. 
                // if there is only one table, inject scope in wherecond
                    this._wherecond  = _firsttable.reformCondition(this._wherecond, this._atablesobj[0].tablename) ;
            }    
        
            let _cNewExpr = this.getReformedExpr(this._wherecond);
            this._whereevalfx = Function("sqlscope", 'return ' + _cNewExpr);

            try {
                this._whereevalfx(this._oTablesScope);
            } catch (error) {
                this._defineerror  = true;
                mylib.showError("Error in Sql syntax : invalid where condition " + this._wherecond + ", " + error);
                return this;
            }    
        }

        //set up a wherecond if not present
        if (this._wherecond == "") {
            this._wherecond = true; 
            this._whereevalfx = Function("sqlscope", 'return true');
        }
        

        if (this._orderbylist !== "") {
            //try to process " custmst a, invhd b"

            // Parse orderby list into _aorderbyobj
            //this._orderbylist = "";
            //this._orderbycount = 0;
            //this._aorderbyobj = [];
            //this._aorderbyobj[0] = {orderbycolname:"", orderbydesc : false};

            let _aOrderByArr = this._orderbylist.split(",");
            this._orderbycount  = _aOrderByArr.length;

            let _cOrderbyStr = "";
            let _aSplitArr = [];

            for (let _nCtr=1; _nCtr <= this._orderbycount; _nCtr++)  {
                this._aorderbyobj[_nCtr-1] = {orderbycolname:"", orderbydesc : false};
            
                //try to process "itemcd " or "batchid desc" or  "batchid asc"
                _cOrderbyStr =  _aOrderByArr[_nCtr-1].trim() ;

                _aSplitArr = [];
                _aSplitArr = _cOrderbyStr.split(" ") ; //split using " "
                if (_aSplitArr.length == 2) {
                    this._aorderbyobj[_nCtr-1].orderbydesc = _aSplitArr[1].trim().toLowerCase() == "desc" ? true : false;  // asc|desc goes here
                    this._aorderbyobj[_nCtr-1].orderbycolname = _aSplitArr[0].trim();  //itemcd goes here
                }  else {
                    this._aorderbyobj[_nCtr-1].orderbycolname = _aSplitArr[0].trim();  //itemcd goes here
                    this._aorderbyobj[_nCtr-1].orderbydesc = false ;
                }
                
                // Check that each of these fields is present in _aFldsObj
                let _lColFound = false ;
                let _nFlds = this._afldsobj.length;
                for (let _nCtrx=1; _nCtrx <= _nFlds ; _nCtrx++) {
                    if (this._afldsobj[_nCtrx-1].fieldname == this._aorderbyobj[_nCtr-1].orderbycolname) {
                        _lColFound = true;
                        break;
                    }    
                }
                
                if (_lColFound == false) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : invalid order by column " + this._aorderbyobj[_nCtr-1].orderbycolname);
                    return this;
                }
            } //end for
            
        } //end if


        //groupbylist - check that each of the fields in groupby is present in _aFldsObj
        if (this._groupbylist !== "") {
            let _aGroupByArr = this._groupbylist.split(",");
            let _nKeyCnt  = _aGroupByArr.length;
            let _cGroupbyStr = "";

            for (let _nCtr=1; _nCtr <= _nKeyCnt; _nCtr++)  {
                _cGroupbyStr =  _aGroupByArr[_nCtr-1].trim() ;

                // Check that each of these fields is present in _aFldsObj
                let _lColFound = false ;
                let _nFlds = this._afldsobj.length;
                for (let _nCtrx=1; _nCtrx <= _nFlds ; _nCtrx++) {
                    if (this._afldsobj[_nCtrx-1].fieldname ==  _cGroupbyStr) {
                        _lColFound = true;
                        break;
                    }    
                }
                
                if (_lColFound == false) {
                    this._defineerror  = true;
                    mylib.showError("Error in Sql syntax : invalid group by column " +  _cGroupbyStr);
                    return this;
                }
            } //end for
        } //end if

    
        return this;
    }


    // NOTE : we can't run the runSql in worker thread, because that will need us to transfer all the tables
    // needed into the worker thread's memory, which is not only difficult but also time consuming, negating
    // any benefits whatsoever.
    //
    // This note is just to remind ourselves why runSql can not be run in worker thread


    /**
     * This method runs the LocalSql attached to the LocalSql Object.
     * 
     *  
     * 
     * @returns {boolean} This function returns true if LocalSql is run successfully , else it return false. 
     * Moreover, the output table is still available to the caller in localsqlobject._resultcursor
     * 
     * @example
     * 
     * //1. create a dummy output table
     * appenv.mycursor = new LocalTable();
     *
     * //2. create LocalSql Object
     * let _oSql = new LocalSql("select itemcd , itemdes, qty as ytdqty, 123.45 as value N:14:5 , userinfo, userinfo.address as address, a.userinfo.address.city as mycity, a.recno() as seq from xtable a into mycursor where a.qty > 100 limit 2", appenv);
     *
     * //3. Invoke runSql method 
     * let _lResult = _oSql.runSql();
     * 
     */

    LocalSql.prototype.runSql =  function() {
        /*  
        Data structure :
        this._sql = _cSql;
        this._distinct = false;

        this._fldslist  = "";
        this._afldsobj = [];
        this._afldsobj[0] = {fldexpr:"",sqlop:"",fieldname:"",datatype:"",len:10,dec:0,objtemplate:"",objclassname:""};

        this._tableslist = "";
        this._tablescount = 0;
        this._atablesobj = [];
        this._atablesobj[0] = {tablename:"",aliasname:""};
        
        this._joinscount = 0;
        this._ajoinsobj  = []
        this._ajoinsobj[0] = {jointype:"",joincond:"",lhsalias:"",lhskeylist:"",rhsalias:"",rhskeylist:"",lhsseq:0,rhsseq:0,joingraphlevel:0,rhsfurtherjoin:false, rhskeyexp : "", lhsvalueexp : ""};
    
        this._selectinto  = "";

        this._wherecond  = "";
        this._whereevalfx = null;

        this._groupbylist = "";

        this._havingcond = "";

        this._orderbylist = "";
        this._orderbycount = 0;
        this._aorderbyobj = [];
        this._aorderbyobj[0] = {orderbycolname:"", orderbydesc : false};

        this._limit       = 0;
        this._resultcursor = ""; 
        */

        if (this._defineerror) {
            mylib.showError("inside runsql - error in sql definition, can not run the SQL") ;
            return false;
        } else {
            //mylib.showError("inside runsql- processing SQL") ;
        }

        let _firsttable = null;
        
        for (let _nCtr=1; _nCtr <= this._tablescount; _nCtr++)  {
            
            //create a reference to the tables used in sql
            let _lTableOk = false; 
            let _cTableName = this._atablesobj[_nCtr-1].tablename ;
            let _cAliasName = this._atablesobj[_nCtr-1].aliasname ;
            let _thistable = null;
            
            if ( mylib.deepReflectHas(this._oTablesScope,_cTableName)) {
                _thistable =  mylib.deepReflectGet(this._oTablesScope,_cTableName) ;
                if (_thistable.constructor.name == "LocalTable") {
                    _lTableOk = true; 
                }
            }


            if (_lTableOk) {
                // we want to evaluate an expression to determine its attributes, if need be 
                // let us commit the uncommitted record if any
                _thistable.commit();

                // store the reference to table object 
                this._atablesobj[_nCtr-1].tableobject = _thistable;

                //reference to the table with given alias
                if (_cAliasName !=="") {
                    // add alias to this._oTablesScope
                    this._oTablesScope[_cAliasName] = _thistable;                    
                }

                if (_nCtr == 1) {
                    _firsttable = _thistable ;
                }

                //for each table save current order and bookmark
                this._atablesobj[_nCtr-1]._savedorder = _thistable._curorder;
                this._atablesobj[_nCtr-1]._savedbookmark = _thistable.xbGetBookMark(); 
            } else {
                this._defineerror  = true;
                mylib.showError("Error in Sql syntax : invalid tablename " + _cTableName );
                return;
            }
    
            //Now, we can refer to input table , say (from mytable a ) in 3 ways :
            // 1. _firsttable  (hard name _firsttable)  
            // 2. sqlscope.mytable  (ie. the tablename specified)
            // 3. sqlscope.a        (ie. the alias name specified)
        } //end for
        

        //2. Then, create a reference to the output tables specified in sql
        let _temptable1  = new LocalTable(this._afldsobj); 
        let _temptable2  = new LocalTable(this._afldsobj); 
        let _temptable3  = new LocalTable(this._afldsobj); 
        let _temptable4  = new LocalTable(this._afldsobj); 
        let _temptable5  = new LocalTable(this._afldsobj); 
        
        let _outstructjson = JSON.stringify(_temptable1._struct) ;

        let _outtable = null;
        if (this._selectinto !== "") {
            let _lTableOk = false;
            if ( mylib.deepReflectHas(this._oTablesScope,this._selectinto)) {
                _outtable = this._resultcursor = mylib.deepReflectGet(this._oTablesScope,this._selectinto) ;
                if (_outtable.constructor.name == "LocalTable") {
                    _lTableOk = true; 
                }
            }
        
            if (! _lTableOk) {
                this._defineerror  = true;
                mylib.showError("Error in Sql syntax : invalid output tablename " + this._selectinto );
                return false;
            }

            _outtable.modiStru(this._afldsobj) ;
            _outtable.zap();
        } else {
            this._resultcursor = new LocalTable(this._afldsobj) ;
        }

        
        if (this._limit == 0) {
            return true;
        }

        
        //3. Now try to run sql
        if (this._tablescount > 0) {
            // restore setdeletedon and setorder later
            //_firsttable.setDeletedOn();
            _firsttable.setOrder(0);
            _firsttable.goTop(true);
            
            while (_firsttable._eof == false) {
                let _lJoinOk = true;
                let _lMoreCombs = true;
                let _nIteration = 0;

                while (_lJoinOk == true && _lMoreCombs == true) {
                    //process joins - always do seek with _lNoCommit = true
                    // look at join dependency graph   

                    _nIteration++;
                    _lMoreCombs = false;
                    // joingraphlevel - 1 : outer loop 
                    for (let _nJoinObjSeq=1;  _nJoinObjSeq <= this._joinscount;  _nJoinObjSeq++ ) {
                        if (this._ajoinsobj[_nJoinObjSeq-1].lhsseq !==1) {
                            continue; 
                        }

                        let _oLevel1Join = this._ajoinsobj[_nJoinObjSeq-1]; 

                        if (_oLevel1Join.jointype == "ansijoin" || _oLevel1Join.jointype == "leftansijoin") {
                            _lMoreCombs = true;
                        }

                        if (_nIteration > 1) {
                            if (_oLevel1Join.jointype == "perpjoin" || _oLevel1Join.jointype == "leftperpjoin" || _oLevel1Join.jointype == "nomatch") {
                                continue; 
                            }
                        }

                        //let _uSeekValue = eval(_oLevel1Join.lhsvalueexp) ;
                        let _uSeekValue = null;
                        try {
                            _uSeekValue =   _oLevel1Join.lhsevalfx(this._oTablesScope) ;
                        } catch (error) {
                            mylib.showError("Error while running sql at  _oLevel1Join.lhsevalfx(): " +  error);
                            return false;
                        }


                        if (_nIteration == 1) {
                            //let _lSeekResult = eval(_oLevel1Join.rhsalias + ".seek(_uSeekValue,true)") ;
                            let _rhsTable = this._atablesobj[_oLevel1Join.rhsseq -1].tableobject;
                            let _lSeekResult = _rhsTable.seek(_uSeekValue,true) ;

                            if (_lSeekResult == false) {
                                if (_oLevel1Join.jointype == "ansijoin" || _oLevel1Join.jointype == "leftansijoin") {
                                    // since first matching record is not found, there is no question of
                                    // subsequent matching records  
                                    _lMoreCombs = false;
                                }
            
                                if (_oLevel1Join.jointype == "perpjoin" || _oLevel1Join.jointype == "ansijoin") {
                                    _lJoinOk = false; 
                                    break;
                                }

                                // seek failed, but it is fine for nomatch, leftperpjoin and leftansijoin

                            } else {
                                // seek on rhsalias is successful 
                                // which is fine in all cases except nomatch
                                if (_oLevel1Join.jointype == "nomatch") {
                                    _lJoinOk = false; 
                                    break;
                                }
                            }

                        } else {
                            //only for ansijoin or leftansijoin
                            //let _lSkipResult = eval(_oLevel1Join.rhsalias + ".skip(1,true)") ;
                            let _rhsTable = this._atablesobj[_oLevel1Join.rhsseq -1].tableobject;
                            let _lSkipResult = _rhsTable.skip(1,true) ;
    
                            if (_lSkipResult == false) {
                                _lJoinOk = false; 
                                break;
                            }    

                            //if (eval(_oLevel1Join.rhskeyexp) !== _uSeekValue) {
                            //    _lJoinOk = false; 
                            //    break;
                            //}    

                            try {
                                if (_oLevel1Join.rhskeyevalfx(this._oTablesScope) !== _uSeekValue) {
                                    _lJoinOk = false; 
                                    break;
                                }    
                            } catch (error) {
                                mylib.showError("Error while running sql at  _oLevel1Join.rhskeyevalfx(): " +  error);
                                return false;
                            }

                        }

        
                        if (_oLevel1Join.rhsfurtherjoin !== true) {
                            continue;
                        }
                        
                        // joingraphlevel - 2 : inner loop - will process only perpjoin, leftperpjoin , nomatch
                        for ( let _nInnerJoinObjSeq=1;  _nInnerJoinObjSeq <= this._joinscount;  _nInnerJoinObjSeq++ ) {
                            if (this._ajoinsobj[_nInnerJoinObjSeq-1].lhsseq !==_oLevel1Join.rhsseq) {
                                continue; 
                            }
        
                            let _oLevel2Join = this._ajoinsobj[_nInnerJoinObjSeq-1] ;
        
                            if (_oLevel2Join.jointype == "perpjoin" || _oLevel2Join.jointype == "leftperpjoin" || _oLevel2Join.jointype == "nomatch") {
                                // process it
                            } else {
                                //ignore
                                continue; 
                            }
    
                            //let _uSeekValue = eval(_oLevel2Join.lhsvalueexp) ;
                            let _uSeekValue = null;
                            try {
                                _uSeekValue =   _oLevel2Join.lhsevalfx(this._oTablesScope) ;
                            } catch (error) {
                                mylib.showError("Error while running sql at  _oLevel2Join.lhsevalfx(): " +  error);
                                return false;
                            }
        

                            //let _lSeekResult = eval(_oLevel2Join.rhsalias + ".seek(_uSeekValue,true)") ;
                            let _rhsTable = this._atablesobj[_oLevel2Join.rhsseq -1].tableobject;
                            let _lSeekResult = _rhsTable.seek(_uSeekValue,true) ;

                            if (_lSeekResult == false) {
                                if (_oLevel2Join.jointype == "perpjoin") {
                                    _lJoinOk = false; 
                                    break;
                                }
                                // seek failed, but it is fine for nomatch and leftperpjoin
                            } else {
                                // seek on innerrhsalias is successful 
                                // which is fine in all cases except nomatch
                                if (_oLevel2Join.jointype == "nomatch") {
                                    _lJoinOk = false; 
                                    break;
                                }
                            }

                            if (_oLevel2Join.rhsfurtherjoin !== true) {
                                continue;
                            }

                            // joingraphlevel - 3  : innermost loop - will process only perpjoin, leftperpjoin , nomatch
                            for ( let _nInnermostJoinObjSeq=1;  _nInnermostJoinObjSeq <= this._joinscount;  _nInnermostJoinObjSeq++ ) {
                                if (this._ajoinsobj[_nInnermostJoinObjSeq-1].lhsseq !==_oLevel2Join.rhsseq) {
                                    continue; 
                                }

                                let _oLevel3Join = this._ajoinsobj[_nInnermostJoinObjSeq-1];

                                if (_oLevel3Join.jointype == "perpjoin" || _oLevel3Join.jointype == "leftperpjoin" || _oLevel3Join.jointype == "nomatch") {
                                    // process it
                                } else {
                                    //ignore
                                    continue; 
                                }

                                //let _uSeekValue = eval(_oLevel3Join.lhsvalueexp) ;
                                let _uSeekValue = null;
                                try {
                                    _uSeekValue =   _oLevel3Join.lhsevalfx(this._oTablesScope) ;
                                } catch (error) {
                                    mylib.showError("Error while running sql at  _oLevel3Join.lhsevalfx(): " +  error);
                                    return false;
                                }
            
        

                                //let _lSeekResult = eval(_oLevel3Join.rhsalias + ".seek(_uSeekValue,true)") ;
                                let _rhsTable = this._atablesobj[_oLevel3Join.rhsseq -1].tableobject;
                                let _lSeekResult = _rhsTable.seek(_uSeekValue,true) ;
                                
                                if (_lSeekResult == false) {
                                    if (_oLevel3Join.jointype == "perpjoin") {
                                        _lJoinOk = false; 
                                        break;
                                    }
                                    // seek failed, but it is fine for nomatch and leftperpjoin
                                } else {
                                    // seek on Innermostrhsalias is successful 
                                    // which is fine in all cases except  nomatch
                                    if (_oLevel3Join.jointype == "nomatch") {
                                        _lJoinOk = false; 
                                        break;
                                    }
                                }

                            } //endfor - joingraphlevel - 3 : innermost loop 

                        } //endfor - joingraphlevel - 2 : inner loop 
        
                    } //endfor - joingraphlevel - 1 : outer loop 


                    if (_lJoinOk == true) {
                        // write output 
                        // evaluate where condition - if it passes - add data
                        let _lWhereCond = false;
                        try {
                            _lWhereCond =  this._whereevalfx(this._oTablesScope) ;
                        } catch (error) {
                            mylib.showError("Error while running sql at  this._whereevalfx(): " +  error);
                            return false;
                        }

                        if (_lWhereCond)  {
                            //object to temporarily hold one record of output table
                            let _thisrecord = JSON.parse(_outstructjson) ;
                
                            //evaluate and assign select fields to _thisrecord
                            let _nFlds = this._afldsobj.length;
                            for (let _nCtr=1; _nCtr <= _nFlds ; _nCtr++) {
                                
                                if (this._afldsobj[_nCtr-1].datatype == "O") {
                                    //let _oSrcObject = eval(this._afldsobj[_nCtr-1].fldexpr);
                                    let _oSrcObject = this._afldsobj[_nCtr-1].evalfx(this._oTablesScope) ;
                                    if (typeof _oSrcObject == "object") {
                                        _thisrecord[this._afldsobj[_nCtr-1].fieldname]  =  JSON.parse(JSON.stringify(_oSrcObject));
                                        // we stringify and thereafter parse to avoid prototypes getting inside this record
                                        continue;
                                    } 

                                    if (typeof _oSrcObject == "string" && _oSrcObject.substr(0,1) == "{" && _oSrcObject.substr(_oSrcObject.length-1,1) == "}") {
                                        // JSON data in a field rather than an object
                                        // we now try to convert it to object
                                        let _fObjEvalFx = Function('return ' + _oSrcObject);
                                        _thisrecord[this._afldsobj[_nCtr-1].fieldname] =  _fObjEvalFx();
                                        continue;
                                    }

                                    // if empty source field - do nothing - it will be fine when localtable goes to that record !
                                    //_thisrecord[this._afldsobj[_nCtr-1].fieldname]  = this._afldsobj[_nCtr-1].objtemplate;
                                    continue;
                                    
                                } else {
                                    if (this._afldsobj[_nCtr-1].datatype == "X") {
                                        // special logic to update object properties with data type "X" - used in 3D SQL
                                        if (this._afldsobj[_nCtr-1].evalfx) {
                                            mylib.deepReflectSet(_thisrecord, this._afldsobj[_nCtr-1].fieldname , this._afldsobj[_nCtr-1].evalfx(this._oTablesScope))  ;
                                        } else {
                                            // not evalfx found - so run eval()
                                            mylib.deepReflectSet(_thisrecord, this._afldsobj[_nCtr-1].fieldname , eval(this._afldsobj[_nCtr-1].fldexpr));
                                        }
                                    } else {
                                        if (this._afldsobj[_nCtr-1].evalfx) {
                                            _thisrecord[this._afldsobj[_nCtr-1].fieldname]  = this._afldsobj[_nCtr-1].evalfx(this._oTablesScope)  ;
                                        } else {
                                            // not evalfx found - so run eval()
                                            _thisrecord[this._afldsobj[_nCtr-1].fieldname]  =  eval(this._afldsobj[_nCtr-1].fldexpr);
                                        }
                                    }
                                }

                            } //endfor 

                            
                            //Now append record into _temptable1
                            _temptable1._reccount++;
                            _temptable1._table[_temptable1._reccount - 1] = _thisrecord;
                        } //endif  
                    } //endif (_lJoinOk == true)
    
                } //end while (_lJoinOk = true && _lMoreCombs == true)
                
                // check limit - if  no distinct or groupby or orderby
                if (this._distinct == false && this._groupbylist == "" &&  this._havingcond == "" && this._orderbylist == "" ) {
                    if (this._limit !== -1) {
                        if  (_temptable1._reccount == this._limit) {
                            break;
                        }
                    }
                }

                //skip to next record in table1 without commit
                _firsttable.skip(1,true);
            } //end while (_firsttable._eof == false) 

            // Go to 1st physical  record of Table, but do not do 
            // commit again. This will bring the data from table array[1] to current
            // record, which might otherwise would have been empty. 
            if (_temptable1._reccount > 0) {
                _temptable1.goTo(1, true);
            }

            //basic temp output table created
    
            //Now, process Group By and SQL Operaters such as count, sum, avg, min, max 
            if (this._groupbylist !== "") {
                _temptable1.indexOn(this._groupbylist);
                _temptable1.goIndexedTop(true); 

                let _lAvgOp = false;
                let _nFlds = this._afldsobj.length;
                for (let _nCtr=1; _nCtr <= _nFlds ; _nCtr++) {
                    if (this._afldsobj[_nCtr-1].sqlop  == "avg") {
                        _lAvgOp = true;
                    }
                }

                // Index Expression
                let _cIndexExp = _temptable1.bldIndexExp(this._groupbylist,"_thisrecord");
                let _fIndexEvalFx = Function("_thisrecord", 'return ' + _cIndexExp);
    
                let _uPrevIndexVal = null ;
                let _nSameKeyRecs = 0;
                
                while (_temptable1._eof == false) {
                    // find key value
                    let _thisrecord = _temptable1._table[_temptable1._recno - 1];
                    //let _uNewIndexVal = eval(_cIndexExp) ;
                    let _uNewIndexVal = _fIndexEvalFx(_thisrecord);

                    // has value changed ?
                    if (_uNewIndexVal == _uPrevIndexVal) {
                        // index value unchanged - process sum, min, max, avg, count
    
                        _nSameKeyRecs++;

                        //process sqlop field for _thisrecord
                        //this._afldsobj[0] = {fldexpr:"",sqlop:"",fieldname:"",datatype:"",len:10,dec:0,objtemplate:"",objclassname:""};
                        let _temprecord = _temptable2._table[_temptable2._reccount - 1];
                        let _nFlds = this._afldsobj.length;
                        for (let _nCtr=1; _nCtr <= _nFlds ; _nCtr++) {
                            if (this._afldsobj[_nCtr-1].sqlop  == "sum" || this._afldsobj[_nCtr-1].sqlop  == "avg") {
                                if (this._afldsobj[_nCtr-1].datatype == "X") {
                                    // special logic to update object properties with data type "X" - used in 3D SQL
                                    let _uValue =  mylib.deepReflectGet(_thisrecord, this._afldsobj[_nCtr-1].fieldname) +  mylib.deepReflectGet(_temprecord, this._afldsobj[_nCtr-1].fieldname)  
                                    mylib.deepReflectSet(_thisrecord, this._afldsobj[_nCtr-1].fieldname , _uValue)  ;
                                } else {
                                    _thisrecord[this._afldsobj[_nCtr-1].fieldname]  =  _thisrecord[this._afldsobj[_nCtr-1].fieldname] + _temprecord[this._afldsobj[_nCtr-1].fieldname];
                                }    
                            }

                            if (this._afldsobj[_nCtr-1].sqlop  == "min") {
                                if (this._afldsobj[_nCtr-1].datatype == "X") {
                                    // special logic to update object properties with data type "X" - used in 3D SQL
                                    let _uValue =  (mylib.deepReflectGet(_thisrecord, this._afldsobj[_nCtr-1].fieldname) <   mylib.deepReflectGet(_temprecord, this._afldsobj[_nCtr-1].fieldname)) ? mylib.deepReflectGet(_thisrecord, this._afldsobj[_nCtr-1].fieldname) : mylib.deepReflectGet(_temprecord, this._afldsobj[_nCtr-1].fieldname) ;  
                                    mylib.deepReflectSet(_thisrecord, this._afldsobj[_nCtr-1].fieldname , _uValue)  ;
                                } else {
                                    _thisrecord[this._afldsobj[_nCtr-1].fieldname]  =  (_thisrecord[this._afldsobj[_nCtr-1].fieldname] < _temprecord[this._afldsobj[_nCtr-1].fieldname]) ? _thisrecord[this._afldsobj[_nCtr-1].fieldname] : _temprecord[this._afldsobj[_nCtr-1].fieldname] ;
                                }    
                            }

                            if (this._afldsobj[_nCtr-1].sqlop  == "max") {
                                if (this._afldsobj[_nCtr-1].datatype == "X") {
                                    // special logic to update object properties with data type "X" - used in 3D SQL
                                    let _uValue =  (mylib.deepReflectGet(_thisrecord, this._afldsobj[_nCtr-1].fieldname) >   mylib.deepReflectGet(_temprecord, this._afldsobj[_nCtr-1].fieldname)) ? mylib.deepReflectGet(_thisrecord, this._afldsobj[_nCtr-1].fieldname) : mylib.deepReflectGet(_temprecord, this._afldsobj[_nCtr-1].fieldname) ;  
                                    mylib.deepReflectSet(_thisrecord, this._afldsobj[_nCtr-1].fieldname , _uValue)  ;
                                } else {
                                    _thisrecord[this._afldsobj[_nCtr-1].fieldname]  =  (_thisrecord[this._afldsobj[_nCtr-1].fieldname] > _temprecord[this._afldsobj[_nCtr-1].fieldname]) ? _thisrecord[this._afldsobj[_nCtr-1].fieldname] : _temprecord[this._afldsobj[_nCtr-1].fieldname] ;
                                }    
                            }

                            if (this._afldsobj[_nCtr-1].sqlop  == "count") {
                                if (this._afldsobj[_nCtr-1].datatype == "X") {
                                    // special logic to update object properties with data type "X" - used in 3D SQL
                                    mylib.deepReflectSet(_thisrecord, this._afldsobj[_nCtr-1].fieldname , _nSameKeyRecs)  ;
                                } else {
                                    _thisrecord[this._afldsobj[_nCtr-1].fieldname]  =  _nSameKeyRecs;
                                }    
                            }

                        } //endfor 

                        // update record in _temptable2
                        _temptable2._table[_temptable2._reccount - 1] = _thisrecord;

                    } else {
                        // index value changed 
                        if (_lAvgOp && _nSameKeyRecs > 0) {
                            // fix _temptable2 record for avg  
                            let _temprecord = _temptable2._table[_temptable2._reccount - 1];
                            let _nFlds = this._afldsobj.length;
                            for (let _nCtr=1; _nCtr <= _nFlds ; _nCtr++) {
                                if (this._afldsobj[_nCtr-1].sqlop  == "avg") {
                                    if (this._afldsobj[_nCtr-1].datatype == "X") {
                                        // special logic to update object properties with data type "X" - used in 3D SQL
                                        let _uValue =  mylib.deepReflectGet(_temprecord, this._afldsobj[_nCtr-1].fieldname) / _nSameKeyRecs;
                                        mylib.deepReflectSet(_temprecord, this._afldsobj[_nCtr-1].fieldname , _uValue)  ;
                                    } else {
                                        _temprecord[this._afldsobj[_nCtr-1].fieldname]  =  _temprecord[this._afldsobj[_nCtr-1].fieldname] / _nSameKeyRecs;
                                    }    
                                }
                            } //endfor 
                        }

                        //Now append record into _temptable2
                        _temptable2._reccount++;
                        _temptable2._table[_temptable2._reccount - 1] = _thisrecord;
                        _nSameKeyRecs = 1 ;

                        // set variable 
                        _uPrevIndexVal = _uNewIndexVal;
                    }    
    
                    //skip to next record in _temptable1 without commit
                    _temptable1.indexedSkip(1,true);
                } //end of while

                // fix for last set of records
                if (_lAvgOp && _nSameKeyRecs > 0) {
                    // fix _temptable2 record for avg  
                    let _temprecord = _temptable2._table[_temptable2._reccount - 1];
                    let _nFlds = this._afldsobj.length;
                    for (let _nCtr=1; _nCtr <= _nFlds ; _nCtr++) {
                        if (this._afldsobj[_nCtr-1].sqlop  == "avg") {
                            if (this._afldsobj[_nCtr-1].datatype == "X") {
                                // special logic to update object properties with data type "X" - used in 3D SQL
                                let _uValue =  mylib.deepReflectGet(_temprecord, this._afldsobj[_nCtr-1].fieldname) / _nSameKeyRecs;
                                mylib.deepReflectSet(_temprecord, this._afldsobj[_nCtr-1].fieldname , _uValue)  ;
                            } else {
                                _temprecord[this._afldsobj[_nCtr-1].fieldname]  =  _temprecord[this._afldsobj[_nCtr-1].fieldname] / _nSameKeyRecs;
                            }    
                        }
                    } //endfor 
                }

                // Go to 1st physical  record of Table, but do not do 
                // commit again. This will bring the data from table array[1] to current
                // record, which might otherwise would have been empty. 
                if (_temptable2._reccount > 0) {
                    _temptable2.goTo(1, true);
                }

            } else {
                _temptable2 = _temptable1;
            }

            // Now, apply having condition 
            if (this._havingcond !=="") {
                _temptable2.goTop(true);
                let _cHavingCond = _temptable2.reformCondition(this._havingcond,"_thisrecord");
                let _fHavingEvalFx = Function("_thisrecord", 'return ' + _cHavingCond);
    
                while (_temptable2._eof == false) {
                    let _thisrecord = _temptable2._table[_temptable2._recno - 1];

                    try {
                        //if (eval(_cHavingCond) == true)
                        if (_fHavingEvalFx(_thisrecord) == true) {
                            //Now append record into _temptable3
                            _temptable3._reccount++;
                            _temptable3._table[_temptable3._reccount - 1] = _thisrecord;
                        }
                    } catch (error) {
                        this._defineerror  = true;
                        mylib.showError("Runtime Error in Sql : invalid having condition " + this._havingcond + ", " + error);
                        break;
                    }    
    
                    //skip to next record in _temptable2 without commit
                    _temptable2.skip(1,true);
                }

                // Go to 1st physical  record of Table, but do not do 
                // commit again. This will bring the data from table array[1] to current
                // record, which might otherwise would have been empty. 
                if (_temptable3._reccount > 0) {
                    _temptable3.goTo(1, true);
                }
            } else {
                _temptable3 = _temptable2;
            }

            // process distinct         
            if (this._distinct == true) {
                let _cKeyList = "";
                for (let _cPropId in _temptable3._struct) {
                    if (_cPropId !== "_deleted" && typeof _temptable3._struct[_cPropId] !== "object") {
                        _cKeyList = ((_cKeyList=="") ? "": _cKeyList+",") + _cPropId ; 
                    }
                } 

                // add objects at end of keylist
                for (let _cPropId in _temptable3._struct) {
                    if (_cPropId !== "_deleted" && typeof _temptable3._struct[_cPropId] == "object") {
                        _cKeyList = ((_cKeyList=="") ? "": _cKeyList+",") + _cPropId ; 
                    }
                } 

                if (_cKeyList !=="") {
                    _temptable3.indexOn(_cKeyList) ;
                    if (_temptable3._curorder > 0) {
                        _temptable3.goIndexedTop(true); 
        
                        // Index Expression
                        let _cIndexExp = _temptable3.bldIndexExp(_cKeyList,"_thisrecord"); 
                        let _fIndexEvalFx = Function("_thisrecord", 'return ' + _cIndexExp);
    
                        let _uPrevIndexVal = null ;
                        while (_temptable3._eof == false) {
                            // find key value
                            let _thisrecord = _temptable3._table[_temptable3._recno - 1];
                            //let _uNewIndexVal = eval(_cIndexExp) ;
                            let _uNewIndexVal = _fIndexEvalFx(_thisrecord);

                            // has value changed ?
                            if (_uNewIndexVal == _uPrevIndexVal) {
                                //IGNORE RECORD
                            } else {
                                // index value changed 
                                //Now append record into _temptable4
                                _temptable4._reccount++;
                                _temptable4._table[_temptable4._reccount - 1] = _thisrecord;
            
                                // set variable 
                                _uPrevIndexVal = _uNewIndexVal;
                            }    
            
                            //skip to next record in _temptable1 without commit
                            _temptable3.indexedSkip(1,true);
                        } //end of while

                        // Go to 1st physical  record of Table, but do not do 
                        // commit again. This will bring the data from table array[1] to current
                        // record, which might otherwise would have been empty. 
                        if (_temptable4._reccount > 0) {
                            _temptable4.goTo(1, true);
                        }

                    } else {
                        _temptable4 = _temptable3;
                    }
                } else {
                    _temptable4 = _temptable3;
                }
            } else {
                _temptable4 = _temptable3;
            }


            // Now, process Order By
            if (this._orderbycount > 0 ) {
                //this._aorderbyobj[0] = {orderbycolname:"", orderbydesc : false};
    
                _temptable4._table.sort(function (a, b) {
                    let _aorderbyobj = this._aorderbyobj ;
                    let _nOrderByCount = _aorderbyobj.length ;
                    let _nResult = 0;
                    for (let _nCtr=1 ; _nCtr <= _nOrderByCount ; _nCtr++) {
                        let _cColName = _aorderbyobj[_nCtr-1].orderbycolname ;
                        let _lDesc =  _aorderbyobj[_nCtr-1].orderbydesc ;
                        let _uFirstValue = Reflect.get(a, _cColName) ;
                        let _uSecondValue = Reflect.get(b, _cColName);
    
                        // Template for sorting:
                        //return a.indexval > b.indexval ? 1 : a.indexval < b.indexval ? -1 : a.recno < b.recno ? -1 : 1 ;
                        if (_nOrderByCount == 1) {
                            // consider record no for sorting (in case of equal key) only if there is one column
                            // in order by list 
                            if (! _lDesc) { 
                                _nResult = _uFirstValue > _uSecondValue ? 1 : _uFirstValue < _uSecondValue ? -1 :  a.recno < b.recno ? -1 : 1 ;
                            } else {
                                _nResult = _uFirstValue > _uSecondValue ? -1 : _uFirstValue < _uSecondValue ? 1 :  a.recno < b.recno ? 1 : -1 ;
                            }
                        } else {
                            if (! _lDesc) { 
                                _nResult = _uFirstValue > _uSecondValue ? 1 : _uFirstValue < _uSecondValue ? -1 :  0 ;
                            } else {
                                _nResult = _uFirstValue > _uSecondValue ? -1 : _uFirstValue < _uSecondValue ? 1 :  0 ;
                            }
                        }

                        if (_nResult !== 0) {
                            break;
                        } else {
                            continue;
                        }
                    }

                    return _nResult;
                }.bind(this));

                // Go to 1st physical  record of Table, but do not do 
                // commit again. This will bring the data from table array[1] to current
                // record, which might otherwise would have been empty. 
                if (_temptable4._reccount > 0) {
                    _temptable4.goTo(1, true);
                }
            } 


            // check limit - if  distinct or groupby or orderby
            if (this._limit !== -1 && (this._distinct == true || this._groupbylist !== "" ||  this._havingcond !== "" || this._orderbylist !== "")) {
                _temptable4.goTop(true);
                while (_temptable4._eof == false) {
                    let _thisrecord = _temptable4._table[_temptable4._recno - 1];

                    //Now append record into _temptable5
                    _temptable5._reccount++;
                    _temptable5._table[_temptable5._reccount - 1] = _thisrecord;

                    if  (_temptable5._reccount == this._limit) {
                        break;
                    }

                    //skip to next record in _temptable2 without commit
                    _temptable4.skip(1,true);
                } 
                
                // Go to 1st physical  record of Table, but do not do 
                // commit again. This will bring the data from table array[1] to current
                // record, which might otherwise would have been empty. 
                if (_temptable5._reccount > 0) {
                    _temptable5.goTo(1, true);
                }
            } else {
                _temptable5 = _temptable4;
            }

            //output table created 
            if (this._selectinto !== "") {
                _outtable.appendFromTable(_temptable5);
                _outtable.goTop(true);
                this._resultcursor = _outtable ;
            } else {
                this._resultcursor =  _temptable5 ;
            }    
    
            _temptable5 = null;
            _temptable4 - null;
            _temptable3 = null;
            _temptable2 - null;
            _temptable1 = null;
            
            // restore saved record pointer and indexorder
            for (let _nCtr=1; _nCtr <= this._tablescount; _nCtr++)  {
                //create a reference to the tables used in sql
                let _cTableName = this._atablesobj[_nCtr-1].tablename ;
                let _thistable = mylib.deepReflectGet(this._oTablesScope,_cTableName) ;
        
                //for each table save current order and bookmark
                //this._atablesobj[_nCtr-1]._savedorder = _thistable._curorder;
                _thistable.setOrder(this._atablesobj[_nCtr-1]._savedorder);

                //this._atablesobj[_nCtr-1]._savedbookmark = _thistable.xbGetBookMark(); 
                _thistable.xbGoToBookMark(this._atablesobj[_nCtr-1]._savedbookmark); 

            } //end for

            return true;
        } //endif   
    } 


    // Private function
    // not declared as const , because we need the access to localsql object and its embeded tablesscope

    LocalSql.prototype.getReformedExpr = function (_cSqlFldExpr) {
        let sqlscope = this._oTablesScope ;

        //we need to tokenize _cSqlFldExpr
        // eg. qty > 100 && rate > 0
        // ["qty", ">" , "100", "&&" , "rate", ">", "0" ]

        //_cSqlFldExpr = "qty > 0 || (qty2*qty3-qty4+qty5/qty6%qty7++qty8--qty9!qty10(qty11)*[qty12]==qty13!=qty14===qty15!==qty16<qty17<=qty18>qty19>=qty20||qty21&&qty22 == '   ' )";

        //if there is one space, make it two spaces - so that one space acts as split seperator
        // and other space is add to array token (which will be added back to reformed string) 
        //_cSqlFldExpr =  _cSqlFldExpr.replace(/\s{1}/g, "  ") ;

        //inject a space before and after each operator and parentheses 
        _cSqlFldExpr = _cSqlFldExpr.replace(/\./g, " . ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\+/g, " + ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/-/g, " - ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\*/g, " * ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\//g, " / ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/%/g, " % ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\!/g, " ! ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\=/g, " = ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/</g, " < ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/>/g, " > ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\|{2}/g, " || ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/&{2}/g, " && ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\(/g, " ( ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\)/g, " ) ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\[/g, " [ ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\]/g, " ] ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\,/g, " , ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\?/g, " ? ");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\:/g, " : ");

        //Now we have a space before and after all operators and parentheses etc.
        //However, now some operators such as ++, --, ==, ===, !=, !==,  <= and >= would have 
        //also been spaced out. Now, we normalize such operators. 
        _cSqlFldExpr = _cSqlFldExpr.replace(/\+{1}\s{2}\+{1}/g, "++");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\-{1}\s{2}\-{1}/g, "--");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\={1}\s{2}\={1}\s{2}\={1}/g, "===");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\!{1}\s{2}\={1}\s{2}\={1}/g, "!==");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\={1}\s{2}\={1}/g, "==");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\!{1}\s{2}\={1}/g, "!=");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\<{1}\s{2}\={1}/g, "<=");
        _cSqlFldExpr = _cSqlFldExpr.replace(/\>{1}\s{2}\={1}/g, ">=");


        //split the expr into an array of tokens
        let _aTokens = [];
        _aTokens = _cSqlFldExpr.split(" ");
        //do not remove null elements , bcuz then a string constant such as "A001  " will get converted to "A001"

        let _nArrLen = _aTokens.length;
        let _cToken = "";
        let _cNewSqlFldExpr = "";
        let _cNxtTkn = "";
        let _cPrvTkn = "";
        
        let _nCtr = 0;
        for (_nCtr = 0; _nCtr <= _nArrLen - 1; _nCtr++) {
            _cToken = _aTokens[_nCtr];

            if (_cToken == "." || _cToken == "+" || _cToken == "++" || _cToken == "-" || _cToken == "--" || _cToken == "*" || _cToken == "/" || _cToken == "%" || _cToken == "!" || _cToken == "==" || _cToken == "!=" || _cToken == "===" || _cToken == "!==" || _cToken == "<" || _cToken == "<=" || _cToken == ">" || _cToken == ">=" || _cToken == "(" || _cToken == ")" || _cToken == "[" || _cToken == "]" || _cToken == "||" || _cToken == "&&"  || _cToken == "," || _cToken == "?" || _cToken == ":") {
                _cNewSqlFldExpr = _cNewSqlFldExpr + _cToken ; //add the token to the new expr 
                continue;
            }

            if (_cToken == "=") {
                mylib.showError("Assignment operator must not be used in an expression");
                return "";
            }

            if (_cToken == "") {
                if (_nCtr + 1 <= _nArrLen - 1) {
                    _cNxtTkn = _aTokens[_nCtr + 1];
                    if (_cNxtTkn == "." || _cNxtTkn == "+" || _cNxtTkn == "++" || _cNxtTkn == "-" || _cNxtTkn == "--" || _cNxtTkn == "*" || _cNxtTkn == "/" || _cNxtTkn == "%" || _cNxtTkn == "!" || _cNxtTkn == "==" || _cNxtTkn == "!=" || _cNxtTkn == "===" || _cNxtTkn == "!==" || _cNxtTkn == "<" || _cNxtTkn == "<=" || _cNxtTkn == ">" || _cNxtTkn == ">=" || _cNxtTkn == "(" || _cNxtTkn == ")" || _cNxtTkn == "[" || _cNxtTkn == "]" || _cNxtTkn == "||" || _cNxtTkn == "&&"  || _cNxtTkn == ","  || _cNxtTkn == "?" || _cNxtTkn == ":") {
                        // there was a space injected to split string, so do not add back space
                    } else {
                        _cNewSqlFldExpr = _cNewSqlFldExpr + " ";  //inject one space, because that is what was used for split                
                    }
                }

                continue;
            }

            if (mylib.IsAllDigit(_cToken)) {
                _cNewSqlFldExpr = _cNewSqlFldExpr + _cToken ; //add the numeric token 
                
                if (_nCtr + 1 <= _nArrLen - 1) {
                    _cNxtTkn = _aTokens[_nCtr + 1];
                    if (_cNxtTkn == "." || _cNxtTkn == "+" || _cNxtTkn == "++" || _cNxtTkn == "-" || _cNxtTkn == "--" || _cNxtTkn == "*" || _cNxtTkn == "/" || _cNxtTkn == "%" || _cNxtTkn == "!" || _cNxtTkn == "==" || _cNxtTkn == "!=" || _cNxtTkn == "===" || _cNxtTkn == "!==" || _cNxtTkn == "<" || _cNxtTkn == "<=" || _cNxtTkn == ">" || _cNxtTkn == ">=" || _cNxtTkn == "(" || _cNxtTkn == ")" || _cNxtTkn == "[" || _cNxtTkn == "]" || _cNxtTkn == "||" || _cNxtTkn == "&&"  || _cNxtTkn == ","  || _cNxtTkn == "?" || _cNxtTkn == ":") {
                        // there was a space injected to split string, so do not add back space
                    } else {
                        _cNewSqlFldExpr = _cNewSqlFldExpr + " ";  //inject one space, because that is what was used for split                
                    }
                }

                continue;
            }

            let _lJustToken = true; // we assume it to be merely a token and not a field/object of some table in sqlscope (ie. this._oTablesScope)
            _cPrvTkn = _aTokens[_nCtr - 1];
            if (_cPrvTkn !== ".") {
                // 1. Check if token exists in sqlscope
                if (mylib.deepReflectHas(sqlscope, _cToken)) {
                    _cToken = "sqlscope." +  _cToken;
                } else {
                    // 2. check if token exists in scope of any table
                    for (let _nCtrx=1; _nCtrx <= this._tablescount; _nCtrx++)  {
                        let _cTempToken = this._atablesobj[_nCtrx-1].tablename + "." + _cToken ;
                        if (mylib.deepReflectHas(sqlscope, _cTempToken)) {
                            _cToken = "sqlscope." +  _cTempToken;
                        }    
                    } 
                }
            }


            _cNewSqlFldExpr = _cNewSqlFldExpr + _cToken; //add the token back to the new expr 
            if (_nCtr + 1 <= _nArrLen - 1) {
                _cNxtTkn = _aTokens[_nCtr + 1];
                if (_cNxtTkn == "." || _cNxtTkn == "+" || _cNxtTkn == "++" || _cNxtTkn == "-" || _cNxtTkn == "--" || _cNxtTkn == "*" || _cNxtTkn == "/" || _cNxtTkn == "%" || _cNxtTkn == "!" || _cNxtTkn == "==" || _cNxtTkn == "!=" || _cNxtTkn == "===" || _cNxtTkn == "!==" || _cNxtTkn == "<" || _cNxtTkn == "<=" || _cNxtTkn == ">" || _cNxtTkn == ">=" || _cNxtTkn == "(" || _cNxtTkn == ")" || _cNxtTkn == "[" || _cNxtTkn == "]" || _cNxtTkn == "||" || _cNxtTkn == "&&"  || _cNxtTkn == ","  || _cNxtTkn == "?" || _cNxtTkn == ":") {
                    // there was a space injected to split string, so do not add back space
                } else {
                    _cNewSqlFldExpr = _cNewSqlFldExpr + " ";  //inject one space, because that is what was used for split                
                }
            }
        }

        return _cNewSqlFldExpr;
    };


    Object.freeze(LocalSql.prototype);

    //export Class
    //if (typeof global == "object") {
    //    //we are in nodejs/vscode environment, so export the module
    //    module.exports = { LocalSql: LocalSql };
    //}


    
    // expose our constructor to the global object
    context.LocalSql = LocalSql;
    
})( this ); 
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
  } = require('graphql');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const User = require('../models/user');
  const Employee = require('../models/employee');
  
  const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: GraphQLID },
      username: { type: GraphQLString },
      email: { type: GraphQLString }
    })
  });
  
  const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      phone: { type: GraphQLString },
      department: { type: GraphQLString },
      position: { type: GraphQLString }
    })
  });
  
  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      login: {
        type: GraphQLString,
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(parent, args) {
          const user = await User.findOne({ email: args.email });
          if (!user) throw new Error("User not found");
          const isMatch = await bcrypt.compare(args.password, user.password);
          if (!isMatch) throw new Error("Invalid credentials");
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return token;
        }
      },
      employees: {
        type: new GraphQLList(EmployeeType),
        resolve() {
          return Employee.find();
        }
      },
      employee: {
        type: EmployeeType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          return Employee.findById(args.id);
        }
      }
    }
  });
  
  const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      signup: {
        type: UserType,
        args: {
          username: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(parent, args) {
          const existingUser = await User.findOne({ email: args.email });
          if (existingUser) throw new Error("User already exists");
          const hashedPassword = await bcrypt.hash(args.password, 10);
          const user = new User({
            username: args.username,
            email: args.email,
            password: hashedPassword
          });
          return user.save();
        }
      },
      addEmployee: {
        type: EmployeeType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          phone: { type: GraphQLString },
          department: { type: GraphQLString },
          position: { type: GraphQLString }
        },
        resolve(parent, args) {
          let employee = new Employee({
            name: args.name,
            email: args.email,
            phone: args.phone,
            department: args.department,
            position: args.position
          });
          return employee.save();
        }
      },
      updateEmployee: {
        type: EmployeeType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          name: { type: GraphQLString },
          email: { type: GraphQLString },
          phone: { type: GraphQLString },
          department: { type: GraphQLString },
          position: { type: GraphQLString }
        },
        async resolve(parent, args) {
          return Employee.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name,
                email: args.email,
                phone: args.phone,
                department: args.department,
                position: args.position
              }
            },
            { new: true }
          );
        }
      },
      deleteEmployee: {
        type: EmployeeType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parent, args) {
          return Employee.findByIdAndRemove(args.id);
        }
      }
    }
  });
  
  module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
  });
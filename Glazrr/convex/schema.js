import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // Users Table in Database...
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("paid")),

    // Usage tracking for plan limits...
    projectsUsed: v.number(),
    exportsThisMonth: v.number(),

    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])

    // User search...
    .searchIndex("search_by_name", { searchField: "name" })
    .searchIndex("search_by_email", { searchField: "email" }),
    
  // Projects Table in Database... 
  projects: defineTable({

    // Basic project info...
    title: v.string(),
    userId: v.id("users"),
    
    // canvas dimension state...
    canvasState: v.any(), // Fabric.js canvas json
    width: v.number(),
    height: v.number(),

    // Image pipeLine...
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),

    // ImageKit transformation state...
    activeTransformation: v.optional(v.string()),

    // background remove...
    backgroundRemoved: v.optional(v.boolean()),

     // Organization
    folderId: v.optional(v.id("folders")),

    // Time stamps...
    createdAt: v.number(),
    updatedAt: v.number(),

  })
  .index("by_user", ["userId"])
  .index("by_user_updated", ["userId", "updatedAt"])
  .index("by_folder", ["folderId"]),


  // Folders Table in Database...
  folders: defineTable({
    name: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"]),
});

// Plan Limit Examples :-
// - FREE: 3 projects, 20 monthly exports, basic features only...
// - PRO: unlimited projects and exports and all AI features...
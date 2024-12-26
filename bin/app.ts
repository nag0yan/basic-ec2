import * as cdk from "aws-cdk-lib";
import { SampleStack } from "../lib/sample-stack.ts";

const app = new cdk.App();
const account = Deno.env.get("CDK_DEFAULT_ACCOUNT");
const region = Deno.env.get("CDK_DEFAULT_REGION");
if (!account || !region) {
  console.error(
    "Please set the profile.",
  );
  Deno.exit(1);
}
console.log("CDK App is running with the following environment.");
console.log(
  `Account: \u001b[32m${account}\u001b[0m, Region: \u001b[32m${region}\u001b[0m`,
);

new SampleStack(app, "SampleStack", {
  env: {
    account,
    region,
  },
});

import {
	GithubActionsIdentityProvider,
	GithubActionsRole,
} from "aws-cdk-github-oidc";
import { Duration, Stack, type StackProps } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export interface GithubActionsOidcStackProps extends StackProps {
  owner: string;
  repo: string;
}

export class GithubActionsOidcStack extends Stack {
	constructor(scope: Construct, id: string, props: GithubActionsOidcStackProps) {
		super(scope, id, props);

		const provider = new GithubActionsIdentityProvider(this, "GithubProvider")
		const role = new GithubActionsRole(this, "DeployRole", {
      roleName: `${props.owner}/${props.repo}/cdk-deploy-role`,
			provider: provider,
			owner: props.owner,
			repo: props.repo,
			maxSessionDuration: Duration.hours(2),
		});

		role.addToPolicy(
			iam.PolicyStatement.fromJson({
				Sid: "AssumeCDKRoles",
				Effect: "Allow",
				Action: "sts:AssumeRole",
				Resource: "*",
				Condition: {
					"ForAnyValue:StringEquals": {
						"iam:ResourceTag/aws-cdk:bootstrap-role": [
							"image-publishing",
							"file-publishing",
							"deploy",
							"lookup",
						],
					},
				},
			}),
		);
	}
}
